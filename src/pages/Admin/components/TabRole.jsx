import "./TabRole.css";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import TabPanel, { Tab } from "src/components/interfaces/Tab/Tab";
import { getUser } from "src/redux/reducer/authSlice";
import {
  AdminTable,
  SchoolTable,
  ScoreTable,
  StatisticTable,
} from "./TabRoles";

const adminTabs = [
  {
    id: "school",
    title: "Thông tin cơ bản",
    content: <SchoolTable />,
    role: "schoolData",
  },
  {
    id: "score",
    title: "Thông tin điểm chuẩn",
    content: <ScoreTable />,
    role: "scoreData",
  },
  {
    id: "statistic",
    title: "Thông tin chỉ tiêu",
    content: <StatisticTable />,
    role: "statisticData",
  },
];
const superAdminTabs = [
  { id: "admin", title: "Quản lý tài khoản", content: <AdminTable /> },
];

const TabRole = () => {
  const currentUser = useSelector(getUser);

  const tabs = useMemo(() => {
    if (currentUser.super_admin) return [...superAdminTabs, ...adminTabs];
    else return adminTabs.filter((tab) => currentUser.role.includes(tab.role));
  }, [currentUser]);

  return (
    <TabPanel activeKey={tabs[0].id}>
      {tabs.map((tab) => (
        <Tab key={tab.id} id={tab.id} title={tab.title}>
          {tab.content}
        </Tab>
      ))}
    </TabPanel>
  );
};

export default TabRole;
