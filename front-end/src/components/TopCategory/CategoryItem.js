import { Button } from "antd";
import { Link } from "react-router-dom";

function CategoryItem({ item, imageUrl }) {
  return (
    <div className="top-cat__box">
      <div className="top-cat__thumbnail">
        <img src={imageUrl} alt={item.name} />
      </div>

      <div className="top-cat__content">
        <h2 className="top-cat__title">{item.name}</h2>
        <div className="top-cat__desc">{item.description}</div>

        <Button className="top-cat__button">
          <Link to={`/categories/${item.id}`}>Xem chi tiết</Link>
        </Button>
      </div>
    </div>
  );
}

export default CategoryItem;