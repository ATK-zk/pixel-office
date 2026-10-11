#!/bin/bash
cd /workspace/office && git add status.json && git -c user.name=ATK-zk -c user.email=ATK-zk@users.noreply.github.com commit -qm "status update" && git push -q
