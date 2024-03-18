const fibo = (N) => {
    let f = [0, 1]; // 最初の二項
    for (let i = 2; i <= N; i++) { // 2からNまで繰り返す
        f.push(f[i - 1] + f[i - 2]); // 配列の最後に新しい項を追加
    }
    return f; // 第0項から第N項までが順に格納された配列を返す
}
