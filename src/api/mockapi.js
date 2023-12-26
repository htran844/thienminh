
const getProductById = (id) => {
    const DATAMOCK = [
        {
          name: "Vợt Cầu Lông Yonex Nanoflare 800 Tour Chính Hãng",
          price: "700",
          moTa: "Yonex Nanoflare 800 Tour có đũa vợt thuộc dạng khá cứng nên ít trợ lực nhiều, ngược lại thì sự chuẩn xác trong những pha điều cầu, bỏ nhỏ lại vô cùng xuất sắc. Chính vì vậy mà những người chơi có kinh nghiệm và kỹ năng tốt sẽ phát huy sức mạnh tối đa như hổ mọc thêm cánh trong từng trận đấu.",
          id: "VNB017163",
        },
        {
          name: "Vợt Cầu Lông Yonex Nanoflare 800 Game Chính Hãng",
          price: "1960",
          moTa: "Vợt cầu lông Yonex Nanoflare 800 Game chính hãng thuộc series mới và HOT nhất của nhà Yonex trong cuối năm 2023, được chính thức được ra mắt vào ngày 17/11/2023. Đây là có thể nói là siêu phẩm rất đáng được mong chờ từ người chơi phong trào cho đến các vận động viên cũng như người chơi chuyên nghiệp khi có nhiều cải tiến vượt bậc.",
          id: "VNB017164",
        },
        {
          name: "Vợt Cầu Lông Yonex Nanoray 72 Light (BO) Chính Hãng",
          price: "750",
          moTa: "Vợt cầu lông Yonex Nanoray 72 Light (Bo) chính hãng là cây vợt được thiết kế dành cho những người mới làm quen và tập luyện cầu lông. Cây vợt nhẹ, dễ kiểm soát, phù hợp với những người chơi thiên về tốc độ và lối đánh điều cầu. Đây là cây vợt thuộc phân khúc sơ cấp của nhà Yonex. Với mức giá rất dễ chịu đi kèm những công năng tuyệt vời của thương hiệu Nhật Bản, Nanoray 72 Light chắc chắn sẽ là một cây vợt quốc dân trong tầm giá dưới 1 triệu.",
          id: "VNB016684",
        },
        {
          name: "Vợt Cầu Lông Yonex Astrox 70 (Mã JP)",
          price: "3719",
          moTa: "Vợt cầu lông Yonex Astrox 70 (Mã JP) tiếp tục là một trong những dòng vợt cầu lông cao cấp được ra mắt bởi hãng Yonex trong thời gian gần đây. Với màu sắc trắng kết hợp xanh nước biển đẹp mắt trông nhẹ nhàng và tinh tế, chiếc vợt này chắc chắn sẽ làm cho người chơi nổi bật hơn trên sân.",
          id: "VNB015085",
        },
        {
          name: "Vợt Cầu Lông Yonex Duora 55 Chính Hãng - Không Bảo Hành",
          price: "1290",
          moTa: "Vợt cầu lông Yonex Doura 55 là mẫu sản phẩm dòng trung cấp trong dòng Doura, đặc trưng của dòng vợt này sự kết hợp cân bằng giữa tốc độ, kiểm soát và sức mạnh, bên cạnh đó ,trọng lượng và độ dẻo đũa còn giúp cây vợt dễ dàng điều khiển và sử dụng cho tất cả mọi đối tượng từ những người chơi trung bình cho đến những tay vợt trình độ khá có thể chọn cho mình phiên bản 3U.",
          id: "VNB014885",
        },
      ];
  let data = null;
  for (let i = 0; i < DATAMOCK.length; i++) {
    const element = DATAMOCK[i];
    if (element.id == id) {
        data = element
    }
  }
  return data;
};
export { getProductById };
