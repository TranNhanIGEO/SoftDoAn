import "./Tab.css";
import { Fragment, useState } from "react";

const TabPanel = ({ activeKey, children }) => {
  const [key, setKey] = useState(activeKey);
  return (
    <div className="tab-container">
      <div className="tabs">
        {children.map((child) => (
          <div
            key={child.props.id}
            className={key === child.props.id ? "tab-item active" : "tab-item"}
            onClick={() => setKey(child.props.id)}
          >
            {child.props.title}
          </div>
        ))}
      </div>
      <div className="tab-content">
        {children.map((child) => (
          <div
            key={child.props.id}
            className={key === child.props.id ? "tab-pane active" : "tab-pane"}
          >
            <span>{child.props.title}</span>
            <div>{child.props.children}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const Tab = () => {
  return <Fragment />;
};

export default TabPanel;
