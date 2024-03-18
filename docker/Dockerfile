# ベースイメージとして ubuntu:latest を使用
FROM ubuntu:latest

# obento ディレクトリを作成し、onigiri ファイルにおにぎりの具を書き込み、
# os9.txt ファイルを直接作成して "chmod +x semester" を含める
# 一つの RUN コマンドで実行してレイヤー数を最小にする
RUN mkdir /obento && \
    echo "紀州梅" > /obento/onigiri && \
    echo "chmod +x semester" > /os9.txt

