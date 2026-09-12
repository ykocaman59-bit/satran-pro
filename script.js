var board = null;
var game = new Chess(); // Satranç motorunu başlatıyoruz

// Taş sürüklenip bırakıldığında çalışacak fonksiyon
function onDragStart (source, piece, position, orientation) {
    // Oyun bittiyse veya sıra diğer oyuncudaysa hamle yaptırma
    if (game.game_over()) return false;

    // Sadece sırası gelen rengin taşlarının oynatılmasına izin ver
    if ((game.turn() === 'w' && piece.search(/^b/) !== -1) ||
        (game.turn() === 'b' && piece.search(/^w/) !== -1)) {
      return false;
    }
}

// Oyuncu taşı bıraktığında hamlenin geçerli olup olmadığını kontrol ederiz
function onDrop (source, target) {
    // Hamleyi satranç motoruna soruyoruz
    var move = game.move({
      from: source,
      to: target,
      promotion: 'q' // Piyon son sınıra ulaştığında otomatik vezir olsun
    });

    // Geçersiz hamleyse taşı eski yerine geri döndür
    if (move === null) return 'snapback';

    updateStatus();
}

// Taş bırakıldıktan sonra görsel tahtayı günceller
function onSnapEnd () {
    board.position(game.fen());
}

// Oyunun durumunu (Şah, Mat, Sıra) ekrana yazdıran fonksiyon
function updateStatus () {
    var status = '';
    var turnColor = game.turn() === 'w' ? 'Beyaz' : 'Siyah';

    if (game.in_checkmate()) {
        status = 'Oyun bitti, Mat! ' + (game.turn() === 'w' ? 'Siyah' : 'Beyaz') + ' kazandı!';
    } else if (game.in_draw()) {
        status = 'Oyun berabere!';
    } else {
        status = 'Devam ediyor';
        if (game.in_check()) {
            status += ' - ŞAH!';
        }
    }

    $('#status').html(status);
    $('#turn').html(turnColor);
}

// Tahta ayarları
var config = {
    draggable: true,
    position: 'start',
    onDragStart: onDragStart,
    onDrop: onDrop,
    onSnapEnd: onSnapEnd
};

// Tahtayı başlat
board = Chessboard('board', config);
updateStatus();

// Yeniden başlat butonu işlevi
$('#resetBtn').on('click', function () {
    game.reset();
    board.start();
    updateStatus();
});

