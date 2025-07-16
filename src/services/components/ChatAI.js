import React, { useState } from 'react';
import { Card, Form, Button, ListGroup } from 'react-bootstrap';

const ChatAI = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const fakeAIResponses = {
    'đà lạt': 'Đà Lạt là điểm đến tuyệt vời! Bạn nên ghé thăm Hồ Xuân Hương, Thung lũng Tình Yêu, Langbiang, và Cầu Rồng. Mùa đẹp nhất là tháng 10-12.',
    'hạ long': 'Vịnh Hạ Long là di sản thế giới! Nên đi tàu du lịch, tham quan hang Sửng Sốt, đảo Titop. Thời điểm đẹp nhất là tháng 4-6 và 9-11.',
    'sapa': 'Sapa nổi tiếng với ruộng bậc thang và khí hậu mát mẻ. Nên đi tháng 9-11 và 3-5. Đừng bỏ lỡ đỉnh Fansipan!',
    'phú quốc': 'Phú Quốc có biển đẹp và hải sản tươi ngon. Nên đi tháng 11-4. Điểm đến: Sao Beach, Suối Tranh, cáp treo Hòn Thơm.',
    
    // Thành phố trực thuộc Trung ương
    'hà nội': 'Hà Nội - thủ đô ngàn năm văn hiến! Tham quan Văn Miếu, Hồ Hoàn Kiếm, phố cổ, Lăng Bác. Mùa đẹp nhất là tháng 3-4 và 10-11.',
    'hồ chí minh': 'TP.HCM sôi động với Dinh Độc Lập, chợ Bến Thành, đường Nguyễn Huệ, quận 1. Khí hậu ổn định quanh năm, tránh mùa mưa tháng 5-10.',
    'đà nẵng': 'Đà Nẵng có bãi biển Mỹ Khê đẹp, Cầu Rồng, Bà Nà Hills. Thời điểm lý tưởng là tháng 2-8, tránh mùa mưa lũ.',
    'hải phòng': 'Hải Phòng - cảng biển lớn với đảo Cát Bà, vịnh Lan Hạ. Nên đi tháng 4-6 và 9-11. Đặc sản bánh đa cua nổi tiếng.',
    'cần thơ': 'Cần Thơ - trái tim ĐBSCL với chợ nổi Cái Răng, vườn trái cây, nhà cổ Bình Thủy. Mùa khô tháng 12-4 là thời điểm tốt nhất.',
    
    // Miền Bắc
    'hà giang': 'Hà Giang nổi tiếng với cao nguyên đá Đồng Văn, hoa tam giác mạch. Tháng 9-11 và 3-5 là thời điểm đẹp nhất để du lịch.',
    'cao bằng': 'Cao Bằng có thác Bản Giốc hùng vĩ, hang Pác Bó lịch sử. Nên đi tháng 9-11 khi nước đầy, thời tiết mát mẻ.',
    'lào cai': 'Lào Cai nổi tiếng với Sapa, ruộng bậc thang Mù Cang Chải. Tháng 9-11 là mùa lúa chín đẹp nhất.',
    'điện biên': 'Điện Biên nổi tiếng với lịch sử chiến thắng Điện Biên Phủ. Nên đi tháng 10-4 khi thời tiết khô ráo, mát mẻ.',
    'lai châu': 'Lai Châu có phong cảnh núi non hùng vĩ, văn hóa dân tộc đa dạng. Thời điểm tốt nhất là tháng 9-11 và 3-5.',
    'sơn la': 'Sơn La nổi tiếng với nhà tù Sơn La, suối nước nóng, mai anh đào. Nên đi tháng 1-3 khi hoa mai nở.',
    'yên bái': 'Yên Bái có ruộng bậc thang Mù Cang Chải tuyệt đẹp. Tháng 9-10 là mùa lúa chín vàng đẹp nhất.',
    'tuyên quang': 'Tuyên Quang có Na Hang, Tân Trào lịch sử. Nên đi tháng 9-11 và 3-5 khi thời tiết mát mẻ.',
    'phú thọ': 'Phú Thọ - đất tổ với đền Hùng, đền Mẫu Âu Cơ. Lễ hội đền Hùng vào tháng 3 âm lịch rất đặc sắc.',
    'vĩnh phúc': 'Vĩnh Phúc có Tam Đảo mát mẻ, khu du lịch sinh thái. Nên đi tháng 4-6 và 9-11 để tránh nắng nóng.',
    'bắc kạn': 'Bắc Kạn có hồ Ba Bể đẹp như tranh, động Puông. Tháng 9-11 và 3-5 là thời điểm lý tưởng.',
    'thái nguyên': 'Thái Nguyên nổi tiếng với chè Tân Cương, hồ Núi Cốc. Nên đi tháng 9-11 và 3-5 khi thời tiết mát mẻ.',
    'lạng sơn': 'Lạng Sơn có động Tam Thanh, chợ Đồng Đăng. Nên đi tháng 9-11 và 3-5, tránh mùa đông lạnh.',
    'quảng ninh': 'Quảng Ninh có vịnh Hạ Long, Cô Tô, Móng Cái. Tháng 4-6 và 9-11 là thời điểm đẹp nhất.',
    'bắc giang': 'Bắc Giang nổi tiếng với lễ hội Lim, chùa Bổ Đà. Nên đi tháng 1-3 khi có lễ hội quan họ.',
    'bắc ninh': 'Bắc Ninh - cái nôi quan họ với chùa Dâu, đền Đô. Tháng 1-3 là mùa lễ hội sôi động.',
    'hưng yên': 'Hưng Yên có chùa Gấm, nhãn lồng Hưng Yên nổi tiếng. Tháng 7-8 là mùa nhãn chín ngọt.',
    'hà nam': 'Hà Nam có chùa Tam Chúc, Bái Đính. Nên đi tháng 1-3 khi lễ hội đầu năm và thời tiết mát mẻ.',
    'nam định': 'Nam Định có chùa Trần, biển Thiên Trường. Tháng 4-6 và 9-11 là thời điểm thích hợp.',
    'thái bình': 'Thái Bình có đền Trần, khu du lịch sinh thái Đồng Châu. Nên đi tháng 9-11 và 3-5.',
    'ninh bình': 'Ninh Bình có Tràng An, Tam Cốc - Bích Động, Hoa Lư. Tháng 3-5 và 9-11 là thời điểm lý tưởng.',
    
    // Miền Trung
    'thanh hóa': 'Thanh Hóa có biển Sầm Sơn, Hải Tiến, động Hoa Tiên. Nên đi tháng 4-8 để tắm biển.',
    'nghệ an': 'Nghệ An có Cửa Lò, Kim Liên, Pù Mát. Tháng 4-8 là mùa tắm biển, tháng 9-11 đi rừng.',
    'hà tĩnh': 'Hà Tĩnh có biển Thiên Cầm, Vũng Áng, Kẻ Gỗ. Nên đi tháng 4-8 khi thời tiết thuận lợi.',
    'quảng bình': 'Quảng Bình có Phong Nha - Kẻ Bàng, động Sơn Trạch. Tháng 2-8 là thời điểm tốt nhất.',
    'quảng trị': 'Quảng Trị có địa đạo Vịnh Mốc, Cửa Tùng. Nên đi tháng 3-8 để tránh mùa mưa lũ.',
    'thừa thiên huế': 'Thừa Thiên Huế - cố đô với Đại Nội, chùa Thiên Mụ, lăng tẩm. Tháng 3-8 là thời điểm lý tưởng.',
    'quảng nam': 'Quảng Nam có Hội An, Mỹ Sơn, Cửa Đại. Tháng 2-8 là mùa khô, thích hợp du lịch.',
    'quảng ngãi': 'Quảng Ngãi có Lý Sơn, Sa Huỳnh, Dung Quất. Nên đi tháng 3-8 khi biển đẹp.',
    'bình định': 'Bình Định có Quy Nhon, Kỳ Co, Eo Gió. Tháng 2-8 là thời điểm tốt nhất để du lịch.',
    'phú yên': 'Phú Yên có Tuy Hòa, Gành Đá Đĩa, Mũi Điện. Nên đi tháng 1-8 khi thời tiết ổn định.',
    'khánh hòa': 'Khánh Hòa có Nha Trang, Cam Ranh, Ninh Vân Bay. Tháng 1-8 là mùa khô, lý tưởng du lịch.',
    'ninh thuận': 'Ninh Thuận có Phan Rang, tháp Chăm Po Klong Garai. Nên đi tháng 1-8 khi thời tiết khô ráo.',
    'bình thuận': 'Bình Thuận có Phan Thiết, Mũi Né, đồi cát. Tháng 11-4 là thời điểm tốt nhất.',
    'kon tum': 'Kon Tum có nhà rông, thác Dray Nur, Plei Ku. Nên đi tháng 11-4 khi thời tiết mát mẻ.',
    'gia lai': 'Gia Lai có Pleiku, biển Hồ, núi lửa Chư Đăng Ya. Tháng 11-4 là mùa khô, thích hợp du lịch.',
    'đắk lắk': 'Đắk Lắk có Buôn Ma Thuột, thác Dray Nur, làng cà phê. Nên đi tháng 11-4 khi thời tiết mát.',
    'đắk nông': 'Đắk Nông có thác Trinh Nữ, Sekumpul, núi lửa Krông Nô. Tháng 11-4 là thời điểm lý tưởng.',
    'lâm đồng': 'Lâm Đồng có Đà Lạt, Bảo Lộc, thác Pongour. Quanh năm mát mẻ, tốt nhất là tháng 10-3.',
    
    // Miền Nam
    'bình phước': 'Bình Phước có Bù Gia Mập, rừng cao su, đồi chè. Nên đi tháng 11-4 khi thời tiết mát mẻ.',
    'tây ninh': 'Tây Ninh có núi Bà Đen, Cao Đài giáo, hầm Củ Chi. Tháng 11-4 là thời điểm tốt nhất.',
    'bình dương': 'Bình Dương có Thủ Dầu Một, khu du lịch Dai Nam. Nên đi tháng 11-4 khi thời tiết mát.',
    'đồng nai': 'Đồng Nai có Cát Tiên, thác Giang Điền, Núi Chứa Chan. Tháng 11-4 là mùa khô thuận lợi.',
    'bà rịa vũng tàu': 'Bà Rịa Vũng Tàu có biển Vũng Tàu, Hồ Tràm, Bình Châu. Nên đi tháng 11-4 khi mát mẻ.',
    'long an': 'Long An có Tân An, khu du lịch Cần Giuộc, đồng ruộng. Tháng 11-4 là thời điểm lý tưởng.',
    'tiền giang': 'Tiền Giang có Mỹ Tho, Cồn Phụng, vườn trái cây. Mùa khô tháng 11-4 là thời điểm tốt nhất.',
    'bến tre': 'Bến Tre - xứ dừa với làng nghề, cồn Phụng, Vàm Hồ. Nên đi tháng 11-4 khi thời tiết mát.',
    'trà vinh': 'Trà Vinh có chùa Khmer, Ao Bà Om, làng du lịch. Tháng 11-4 là mùa khô, thích hợp du lịch.',
    'vĩnh long': 'Vĩnh Long có Cù Lao An Bình, vườn trái cây, chợ nổi. Nên đi tháng 11-4 khi ít mưa.',
    'đồng tháp': 'Đồng Tháp có Cao Lãnh, vườn quốc gia Tràm Chim, hoa sen. Tháng 11-4 là thời điểm lý tưởng.',
    'an giang': 'An Giang có Châu Đốc, núi Sam, chợ nổi Long Xuyên. Nên đi tháng 11-4 khi mùa nước nổi.',
    'kiên giang': 'Kiên Giang có Phú Quốc, Hà Tiên, U Minh Hạ. Tháng 11-4 là mùa khô, tốt nhất du lịch.',
    'hậu giang': 'Hậu Giang có Vị Thanh, vườn trái cây, làng nghề. Nên đi tháng 11-4 khi thời tiết mát mẻ.',
    'sóc trăng': 'Sóc Trăng có chùa Khmer, Kh\'leang, bánh ít lá gai. Tháng 11-4 là thời điểm thích hợp.',
    'bạc liêu': 'Bạc Liêu có nhà thờ Đức Bà, vườn chim, cánh đồng muối. Nên đi tháng 11-4 khi khô ráo.',
    'cà mau': 'Cà Mau có mũi Cà Mau, rừng U Minh Hạ, làng nổi. Tháng 11-4 là mùa khô, lý tưởng du lịch.'
};

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { type: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);

    // Tìm response phù hợp
    const lowercaseInput = input.toLowerCase();
    let response = fakeAIResponses.default;
    
    for (const [key, value] of Object.entries(fakeAIResponses)) {
      if (lowercaseInput.includes(key) && key !== 'default') {
        response = value;
        break;
      }
    }

    setTimeout(() => {
      const aiMessage = { type: 'ai', text: response };
      setMessages(prev => [...prev, aiMessage]);
    }, 1000);

    setInput('');
  };

  return (
    <Card className="mb-4">
      <Card.Header>
        <h5>🤖 Trợ lý du lịch AI</h5>
      </Card.Header>
      <Card.Body>
        <div style={{ height: '300px', overflowY: 'auto', marginBottom: '1rem' }}>
          <ListGroup variant="flush">
            {messages.length === 0 && (
              <ListGroup.Item>
                <em>Xin chào! Tôi có thể tư vấn về các điểm du lịch. Hãy hỏi tôi!</em>
              </ListGroup.Item>
            )}
            {messages.map((msg, index) => (
              <ListGroup.Item key={index} className={msg.type === 'user' ? 'text-end' : ''}>
                <strong>{msg.type === 'user' ? 'Bạn' : 'AI'}:</strong> {msg.text}
              </ListGroup.Item>
            ))}
          </ListGroup>
        </div>
        <Form onSubmit={handleSubmit}>
          <div className="d-flex gap-2">
            <Form.Control
              type="text"
              placeholder="Hỏi về điểm du lịch..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <Button type="submit" variant="primary">
              Gửi
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default ChatAI;