import { Carousel, Col, Row } from "antd";
import "./TopCategory.scss";
import { Link } from "react-router-dom";
import { RightOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { getCategories } from "../../services/categoryService";
import CategoryItem from "./CategoryItem";

const imageUrls = [
  "https://images.unsplash.com/photo-1544640808-32ca72ac7f37?w=800&q=80",
  "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&q=80",
  "https://images.unsplash.com/photo-1474932430478-367dbb6832c1?w=800&q=80",
  "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&q=80",
  "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&q=80",
  "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&q=80",
  "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80",
  "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&q=80",
  "https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=800&q=80",
  "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=800&q=80",
  "https://images.unsplash.com/photo-1544640808-32ca72ac7f37?w=800&q=80",
  "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&q=80",
  "https://images.unsplash.com/photo-1474932430478-367dbb6832c1?w=800&q=80",
  "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&q=80",
  "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&q=80",
  "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&q=80",
  "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80",
  "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&q=80",
  "https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=800&q=80",
  "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=800&q=80"
];

// Hàm chia mảng thành từng nhóm (2 item / slide)
const chunkArray = (arr, size) => {
  const result = [];
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }
  return result;
};

function TopCategory() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchApi = async () => {
      const result = await getCategories();
      setData(result.content || []);
    };

    fetchApi();
  }, []);

  const groupedData = chunkArray(data, 2);

  return (
    <>
      <Row gutter={[20, 20]} align="middle">
        <Col span={20}>
          <h1>Các danh mục xu hướng</h1>
        </Col>
        <Col span={4} style={{ textAlign: "right" }}>
          <Link to="/categories">
            Khám phá ngay <RightOutlined />
          </Link>
        </Col>
      </Row>

      <Carousel autoplay autoplaySpeed={3000} pauseOnHover={false}>
        {groupedData.map((group, slideIndex) => (
          <div key={slideIndex}>
            <Row gutter={20}>
              {group.map((item, itemIndex) => {
                const imageIndex = slideIndex * 2 + itemIndex;
                return (
                  <Col span={12} key={item.id}>
                    <CategoryItem
                      item={item}
                      imageUrl={imageUrls[imageIndex]}
                    />
                  </Col>
                );
              })}
            </Row>
          </div>
        ))}
      </Carousel>
    </>
  );
}

export default TopCategory;