# AlmaLinuxでのリソース確認とDockerクリーンアップ完全ガイド

## はじめに

AlmaLinuxサーバーでディスク容量不足に遭遇したことはありませんか？特にDockerを使用している環境では、不要なイメージやコンテナが蓄積され、知らぬ間にストレージを圧迫していることがあります。

この記事では、AlmaLinuxでのシステムリソース確認からDockerの効率的なクリーンアップ、さらにVMwareでのディスク容量拡張まで包括的に解説します。

## 対象読者

- AlmaLinuxを使用している開発者・運用担当者
- Dockerでディスク容量不足に悩んでいる方
- VMware環境でのディスク容量拡張を学びたい方
- システムリソースの監視・管理を学びたい方

## 1. システムリソースの現状確認

### 1.1 ディスク使用量の確認

まずは全体的なディスク使用状況を把握しましょう。

```bash
# ファイルシステム全体の使用量を確認
df -h

# 特定のディレクトリの使用量を確認
du -sh /var/lib/docker
du -sh /tmp
du -sh /run/user/1000
```

**出力例：**
```
Filesystem      Size  Used Avail Use% Mounted on
/dev/sda1        20G   15G  4.2G  79% /
tmpfs           2.0G   12K  2.0G   1% /run/user/1000
```

### 1.2 メモリ使用量の確認

```bash
# メモリ使用状況を確認
free -h

# プロセス別メモリ使用量（上位10件）
ps aux --sort=-%mem | head -10
```

### 1.3 一時ディレクトリの容量制限確認

特に `/run/user/1000` は tmpfs で容量制限があるため要注意です。

```bash
# tmpfsの設定を確認
df -h /run/user/1000

# systemdユーザーランタイム設定を確認
systemctl --user show-environment | grep -i runtime
```

## 2. Dockerリソースの詳細分析

### 2.1 Docker全体のリソース使用量確認

```bash
# Docker全体のリソース使用量を表示
docker system df

# より詳細な情報を表示
docker system df -v
```

**出力例：**
```
TYPE            TOTAL     ACTIVE    SIZE      RECLAIMABLE
Images          15        5         2.1GB     1.8GB (85%)
Containers      8         2         45MB      32MB (71%)
Local Volumes   3         1         156MB     104MB (66%)
Build Cache     12        0         1.2GB     1.2GB (100%)
```

### 2.2 各リソースの詳細確認

```bash
# 停止中のコンテナを確認
docker ps -a --filter "status=exited"

# 使用されていないイメージを確認
docker images --filter "dangling=true"

# 使用されていないネットワークを確認
docker network ls --filter "dangling=true"

# ビルドキャッシュの確認
docker builder df
```

## 3. 段階的Dockerクリーンアップ

### 3.1 停止中のコンテナ削除

```bash
# 停止中のコンテナをすべて削除
docker container prune -f

# 特定期間以上前に停止したコンテナのみ削除
docker container prune --filter "until=24h" -f
```

### 3.2 不要なイメージ削除

```bash
# danglingイメージ（タグのないイメージ）を削除
docker image prune -f

# 使用されていないイメージをすべて削除（より積極的）
docker image prune -a -f

# 特定期間以上前のイメージを削除
docker image prune -a --filter "until=168h" -f  # 1週間以上前
```

### 3.3 ネットワークとビルドキャッシュの削除

```bash
# 使用されていないネットワークを削除
docker network prune -f

# ビルドキャッシュを削除
docker builder prune -f

# すべてのビルドキャッシュを削除（より積極的）
docker builder prune -a -f
```

## 4. 一括クリーンアップ（推奨手順）

### 4.1 安全な一括クリーンアップ

```bash
# 何が削除されるかを事前確認（実際には削除しない）
docker system prune --dry-run

# volumes以外のすべての未使用リソースを削除
docker system prune -f

# より積極的（未使用イメージも含む）
docker system prune -a -f
```

### 4.2 volumesを保護した一括クリーンアップ

volumesは重要なデータを含む可能性があるため、明示的に除外します。

```bash
# volumes以外を個別に削除
docker container prune -f && \
docker image prune -a -f && \
docker network prune -f && \
docker builder prune -a -f
```

## 5. クリーンアップ後の確認と最適化

### 5.1 削除効果の確認

```bash
# クリーンアップ後のリソース使用量を確認
docker system df

# システム全体のディスク使用量を再確認
df -h

# Dockerディレクトリのサイズを確認
du -sh /var/lib/docker
```

### 5.2 定期的なメンテナンス設定

cronを使用して定期的にクリーンアップを実行します。

```bash
# crontabを編集
crontab -e

# 毎週日曜日の午前2時にクリーンアップを実行
0 2 * * 0 docker system prune -f --filter "until=168h"
```

## 6. トラブルシューティング

### 6.1 よくあるエラーと対処法

#### エラー: "デバイスに空き領域がありません"

```bash
# 一時ディレクトリの確認
df -h /tmp /run/user/1000

# 環境変数でダウンロード先を変更
export TMPDIR=/tmp
# または
export TMPDIR=/home/$(whoami)/tmp
mkdir -p /home/$(whoami)/tmp
```

#### エラー: "permission denied"

```bash
# Dockerグループに追加されているか確認
groups $USER

# 必要に応じてDockerグループに追加
sudo usermod -aG docker $USER
# 再ログインが必要
```

### 6.2 緊急時の対応

ディスク使用率が95%を超えた場合の緊急対応：

```bash
# 最も積極的なクリーンアップを実行
docker system prune -a -f --volumes

# ログファイルの削除
sudo journalctl --vacuum-time=7d
sudo find /var/log -name "*.log" -type f -mtime +7 -delete
```

## 7. VMwareでのディスク容量拡張

クリーンアップでも容量が足りない場合は、VMware仮想マシンのディスク容量を拡張する必要があります。

### 7.1 VMware vSphere Client / vCenter での拡張

#### 仮想マシンの設定変更

1. **仮想マシンの停止**
   ```bash
   # AlmaLinux側でシャットダウン
   sudo shutdown -h now
   ```

2. **VMware vSphere Clientで設定変更**
   - 仮想マシンを右クリック → 「設定の編集」
   - 「ハードディスク」を選択
   - 「ディスクサイズ」を増加（例：20GB → 50GB）
   - 「OK」をクリックして設定を保存

#### VMware Workstation / Player での拡張

1. **仮想マシンの停止**
2. **VMware Workstation/Playerで設定変更**
   - 仮想マシンを右クリック → 「設定」
   - 「ハードディスク」を選択
   - 「ユーティリティ」→ 「拡張」
   - 新しいサイズを入力（例：50GB）

### 7.2 AlmaLinux側でのパーティション拡張

VMware側でディスクを拡張した後、AlmaLinux側でパーティションを認識・拡張する必要があります。

#### パーティション状況の確認

```bash
# 現在のディスク状況を確認
lsblk

# パーティションテーブルの確認
sudo fdisk -l /dev/sda

# ファイルシステムの確認
df -h
```

**出力例：**
```
NAME   MAJ:MIN RM  SIZE RO TYPE MOUNTPOINT
sda      8:0    0   50G  0 disk 
├─sda1   8:1    0    1G  0 part /boot
├─sda2   8:2    0    2G  0 part [SWAP]
└─sda3   8:3    0   17G  0 part /
```

#### growpartを使用した自動拡張（推奨）

```bash
# cloud-utilsをインストール（growpartコマンド用）
sudo dnf install -y cloud-utils-growpart

# パーティション3を自動拡張
sudo growpart /dev/sda 3

# ファイルシステムを拡張
sudo xfs_growfs /
# ext4の場合は: sudo resize2fs /dev/sda3
```

#### 手動でのパーティション拡張

```bash
# fdiskでパーティションを拡張
sudo fdisk /dev/sda

# fdisk内での操作：
# p (パーティション情報表示)
# d (削除) → 3 (パーティション3を削除)
# n (新規作成) → p (プライマリ) → 3 → Enter → Enter
# w (書き込み)

# システムを再起動
sudo reboot

# ファイルシステムを拡張
sudo xfs_growfs /
```

### 7.3 LVM使用時の拡張

LVM（Logical Volume Manager）を使用している場合の拡張手順：

```bash
# 物理ボリュームの拡張
sudo pvresize /dev/sda3

# ボリュームグループの確認
sudo vgdisplay

# 論理ボリュームの拡張
sudo lvextend -l +100%FREE /dev/mapper/almalinux-root

# ファイルシステムの拡張
sudo xfs_growfs /
```

### 7.4 拡張後の確認

```bash
# ディスク使用量の最終確認
df -h

# パーティション情報の確認
lsblk

# ファイルシステムの整合性チェック（必要に応じて）
sudo xfs_repair -n /dev/sda3  # XFSの場合
```

**期待される出力例：**
```
Filesystem      Size  Used Avail Use% Mounted on
/dev/sda3        47G   15G   30G  34% /
```

### 7.5 注意点とトラブルシューティング

#### 重要な注意点

- **バックアップの取得**: 拡張作業前に必ずデータのバックアップを取得
- **仮想マシンの停止**: ディスク拡張時は仮想マシンを完全に停止
- **スナップショット**: 可能であれば拡張前にVMのスナップショットを作成

#### よくある問題と対処法

**問題1: growpartが見つからない**
```bash
# EPELリポジトリを有効化してインストール
sudo dnf install -y epel-release
sudo dnf install -y cloud-utils-growpart
```

**問題2: パーティションが認識されない**
```bash
# カーネルにパーティションテーブルの変更を通知
sudo partprobe /dev/sda

# または再起動
sudo reboot
```

**問題3: XFSファイルシステムの拡張に失敗**
```bash
# マウント状態を確認
mount | grep /dev/sda3

# アンマウントして修復後に再拡張
sudo umount /
# （緊急時のみ、通常は再起動推奨）
```

## 8. 予防策とベストプラクティス

### 8.1 定期監視の設定

```bash
# ディスク使用率監視スクリプト
#!/bin/bash
THRESHOLD=80
USAGE=$(df / | awk 'NR==2 {print $5}' | sed 's/%//')

if [ $USAGE -gt $THRESHOLD ]; then
    echo "Warning: Disk usage is ${USAGE}%"
    docker system df
fi
```

### 8.2 開発環境でのベストプラクティス

- **multi-stage buildの活用**: 最終イメージサイズを削減
- **適切な.dockerignoreの設定**: 不要なファイルをコンテキストから除外
- **定期的なイメージ更新**: 古いイメージの蓄積を防ぐ

```dockerfile
# multi-stage buildの例
FROM node:16 AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

FROM node:16-alpine
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY . .
CMD ["npm", "start"]
```

## まとめ

AlmaLinuxでのDockerリソース管理は、定期的な監視とクリーンアップが重要です。この記事で紹介した手順を参考に、以下のポイントを押さえてください：

1. **定期的なリソース確認**: `docker system df`でリソース使用量を把握
2. **段階的なクリーンアップ**: 重要なデータを保護しながら不要なリソースを削除
3. **VMwareディスク拡張**: クリーンアップで不足する場合の根本的解決
4. **自動化の活用**: cronやスクリプトで定期メンテナンスを実装
5. **予防策の実施**: 効率的なDockerfileとベストプラクティスの適用

適切なリソース管理により、安定したDockerコンテナ環境を維持できるでしょう。

## 参考資料

- [Docker公式ドキュメント - docker system prune](https://docs.docker.com/engine/reference/commandline/system_prune/)
- [AlmaLinux公式サイト](https://almalinux.org/)
- [systemd tmpfs設定](https://www.freedesktop.org/software/systemd/man/tmpfs.html)
- [VMware vSphere ディスク管理](https://docs.vmware.com/jp/VMware-vSphere/)
- [Linux パーティション管理 - fdisk](https://man7.org/linux/man-pages/man8/fdisk.8.html)

---

この記事がAlmaLinuxとDockerの運用に役立てば幸いです。質問や改善提案があれば、コメントでお知らせください！