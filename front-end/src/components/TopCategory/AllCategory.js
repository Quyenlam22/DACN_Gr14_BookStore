import { useEffect, useState } from "react";
import { getCategories } from "../../services/categoryService";
import CategoryItem from "./CategoryItem";
import { Col, Row } from "antd";
import { paginate } from "../../utils/paginate";
import Paginate from "../Paginate";
import { Outlet } from "react-router-dom";

const imageUrls = [
  "https://images.unsplash.com/photo-1544640808-32ca72ac7f37?w=800&q=80", // 1. Tiếng Việt
  "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&q=80", // 2. Kinh tế (Mới)
  "https://images.unsplash.com/photo-1474932430478-367dbb6832c1?w=800&q=80", // 3. Văn học
  "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&q=80", // 4. Kỹ năng sống (Mới)
  "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&q=80", // 5. Thiếu nhi
  "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&q=80", // 6. Ngoại ngữ
  "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80", // 7. Tin học
  "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&q=80", // 8. Tâm lý
  "https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=800&q=80", // 9. Nuôi dạy con (Mới)
  "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=800&q=80",  // 10. Sách khác (Mới)
  "https://images.unsplash.com/photo-1544640808-32ca72ac7f37?w=800&q=80", // 1. Tiếng Việt
  "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&q=80", // 2. Kinh tế (Mới)
  "https://images.unsplash.com/photo-1474932430478-367dbb6832c1?w=800&q=80", // 3. Văn học
  "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&q=80", // 4. Kỹ năng sống (Mới)
  "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&q=80", // 5. Thiếu nhi
  "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&q=80", // 6. Ngoại ngữ
  "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80", // 7. Tin học
  "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&q=80", // 8. Tâm lý
  "https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=800&q=80", // 9. Nuôi dạy con (Mới)
  "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=800&q=80"  // 10. Sách khác (Mới)
];

function AllCategory () {
    const [data, setData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        const fetchApi = async () => {
            const result = await getCategories();
            setData(result.content);
        }

        fetchApi();
    }, []);

    const pagination = paginate(data, currentPage, 2);

    return (
        <>
            <Outlet/>
            <h2>Khám phá thể loại</h2>
            <Row gutter={[30, 30]}>
                {pagination.currentItems && (
                    pagination.currentItems.map((item, index) => (
                        <Col span={12}>
                            <CategoryItem item={item} imageUrl={imageUrls[index]}/>
                        </Col>
                    ))
                )}
            </Row>

            <Paginate pagination={pagination} setCurrentPage={setCurrentPage}/>
        </>
    )
}

export default AllCategory;