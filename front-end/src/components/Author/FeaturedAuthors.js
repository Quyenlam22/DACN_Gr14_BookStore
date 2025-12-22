import { Card, Col, Row, Typography, Avatar, Button } from "antd";
import { useEffect, useState } from "react";
import { getAuthors } from "../../services/authorService"; // API gọi danh sách tác giả
import { useNavigate } from "react-router-dom";
import Paginate from "../Paginate";
import { paginate } from "../../utils/paginate";

const { Title, Text } = Typography;

function FeaturedAuthors() {
  const [authors, setAuthors] = useState([]);
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchAuthors = async () => {
      const result = await getAuthors();
      const featured = result.content; // Giới hạn 4 tác giả nổi bật
      setAuthors(featured);
    };
    fetchAuthors();
  }, []);

  const pagination = paginate(authors, currentPage, 8);

  return (
    <div style={{ padding: '24px 0' }}>
      <Title level={3}>Tác giả nổi bật</Title>
      <Row gutter={[16, 16]}>
        {pagination.currentItems.map(author => (
          <Col key={author.id} xs={24} sm={12} md={6} style={{ display: 'flex' }}>
            <Card
              hoverable
              style={{ borderRadius: 12, width: '100%', height: '400px' }}
              cover={
                <Avatar
                  size={96}
                  src={author.profileImage}
                  style={{ margin: '16px auto' }}
                  alt={author.title}
                />
              }
            >
              <div style={{ textAlign: 'center' }}>
                <Title level={4}>{author.name}</Title>
                <Text type="secondary" style={{ display: 'block' }}>{author.bio.slice(0,30)}...</Text>
              </div>
              <div style={{ textAlign: 'center', marginTop: 12 }}>
                <Button size="large" type="primary" onClick={() => navigate(`/authors/${author.id}`)}>
                  Xem thêm
                </Button>
              </div>
            </Card>
          </Col>
        ))}
      </Row>
      <Paginate pagination={pagination} setCurrentPage={setCurrentPage}/>
    </div>
  );
}

export default FeaturedAuthors;
