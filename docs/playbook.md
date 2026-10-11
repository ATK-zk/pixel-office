# Playbook — how the team tells the strategy engine what to trade

The droplet strategy engine (`/opt/pmbot/engine.py`, PAPER mode) reads `status.json["playbook"]` from this repo
every minute. **No playbook = no new trades.** Update it every 8h meeting. Edit `status.json`, commit and push.

## Format

```json
"playbook": {
  "id": "2026-10-11 21:43",
  "updated_by": "Alex",
  "entries": [
    {
      "plan": "2026-10-11 21:43",
      "symbol": "SOL-USD",
      "strategy": "breakout",
      "params": {"interval": "1h", "lookback": 24, "atr_n": 14, "stop_atr": 2.0, "rr": 1.5},
      "side_bias": "both",
      "risk_pct": 2,
      "enabled": true,
      "valid_until": "2026-10-12T05:43:00+07:00",
      "close_on_remove": false
    }
  ]
}
```

| field | type | required | meaning |
|---|---|---|---|
| `id` (top) | string | recommended | plan id/timestamp. Copied into every trade log line as `plan` unless the entry has its own `plan` |
| `symbol` | string | yes | any Perps symbol, `SOL` or `SOL-USD` |
| `strategy` | enum | yes | `breakout`, `mean_reversion`, `trend_follow`, `mm`, `funding_carry` |
| `params` | object | no | strategy parameters (table below); missing keys use defaults |
| `side_bias` | `long` / `short` / `both` | no (both) | signals against the bias are skipped |
| `risk_pct` | number, % of base | no (2) | risk per trade; **capped at 2** by the engine |
| `enabled` | bool | no (true) | `false` = ignored |
| `valid_until` | ISO time (Thai if no offset) | no | after it the entry is ignored, same as removed |
| `close_on_remove` | bool | no (false) | when the entry disappears/expires: `true` = close the position at market; `false` = keep its stop/target until it exits |
| `earnings_at` | ISO time | stocks | earnings time. Also readable from `status.json["earnings"]["NVDA"]` |
| `plan` | string | no | overrides the top-level `id` |

Unknown strategies, unknown symbols, expired and disabled entries are ignored, and this is logged.
The key is `SYMBOL:strategy`, so at most one entry per strategy per symbol, and **one open position per symbol** overall.

## Strategies and params (defaults)

- **breakout**: `interval` 1h, `lookback` 24, `atr_n` 14, `stop_atr` 2.0, `rr` 1.5. Checked when a bar closes: close above the high of the last N bars -> long, below the low -> short.
- **mean_reversion**: `interval` 1h, `bb_n` 20, `bb_k` 2, `rsi_n` 14, `rsi_low` 30, `rsi_high` 70, `stop_atr` 1.5, `min_rr` 1.0. Close outside the band and RSI extreme -> fade it. Target = middle band.
- **trend_follow**: `interval` 1h, `ema_fast` 20, `ema_slow` 50, `trail_atr` 2.5, `target_atr` (none by default). Enters on an EMA cross. The stop trails `trail_atr` x ATR behind price.
- **funding_carry**: `interval` 1h, `min_funding_rate` 0.0001 (per hour), `stop_atr` 2, `target_atr` 3. Takes the side that receives funding and exits if funding flips. Funding is accrued in paper.
- **mm**: `quote_pct` 0.15, `size_usd` (default 46% of base), `max_inventory_usd` (default 70% of base), `inv_stop_usd` (default base x risk_pct), `trend_pct` 0.3, `max_spread_pct` 0.1. Paper port of mmbot: post-only quotes around mid, fills only when the price trades through, inventory skew, cap, trend pause, inventory stop with a 30-min pause. Inventory is flattened if the entry is removed.

## Always enforced by the engine (Jhon), whatever the playbook says

- Risk <= 2% of base per trade. <= 10x leverage per trade (5x for stocks). <= 15x total. Max 3 open. Total open risk <= 6%.
- Daily loss 6% -> no entries for the rest of the day. 3 losses in a row -> 4h pause.
- Weekly loss 15%, drawdown 25% from peak, cumulative -6R, or net negative after 20 trades -> **HALT** until the owner runs `engine.py --clear-halt`. Open stops/targets keep working.
- News windows: no new entries (Hammack Oct 12 22:40-23:40, CPI Oct 14 19:00-20:00, the other fixed windows, and `next_event` +-30 min or its `pause_start`/`pause_end`).
- Per class:
  - **stocks**: half size, <= 5x; no entry if earnings fall within `max_hold_h` (default 72h); closed 30 min before earnings; no entries while the stock market is closed.
  - **small coins** (crypto other than BTC/ETH/SOL): skipped if the spread is > 0.1%.
  - **indices/commodities**: half size while the underlying is closed or opened less than 30 min ago.
- Prices/sizes are rounded to each instrument's tick (max 5 significant figures), qty step and min notional.

## Results

`status.json["paper"]` has `results` (per `SYMBOL:strategy`: trades, wins, losses, pnl, fees, volume, r_sum),
`results_by_strategy`, and `results_by_symbol`. Every trade line in `logs/paper_trades.jsonl` has `strategy`, `plan`, `symbol`, `side`, `entry`, `stop`, `target`, `exit`, `pnl`, `fees` and `reason`.
