import './Sidebar.css'
import SchoolIcon from '@mui/icons-material/School';
import AssessmentIcon from '@mui/icons-material/Assessment';
import ListIcon from '@mui/icons-material/List';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import TopicIcon from '@mui/icons-material/Topic';
import { useContext, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContext } from 'src/contexts/MapContext';

const Sidebar = () => {
    const bigScreen = window.innerWidth > 768
    const {setIsOpenModalEnrollment} = useContext(MapContext)
    const {setIsOpenModalStatistic} = useContext(MapContext)
    const {setIsOpenOffCanvasSchoolList} = useContext(MapContext)
    const {isCloseSidebar, setIsCloseSidebar} = useContext(MapContext)
    const [isHoverSidebar, setIsHoverSidebar] = useState(true)
    const [statusSidebar, setStatusSidebar] = useState(bigScreen ? 'close hoverable' : 'close')
    const sidebarRef = useRef(null)
    const navigate = useNavigate()

    useEffect(() => {
        switch (bigScreen) {
            case true:
            switch (true) {
                case isCloseSidebar && isHoverSidebar:
                setStatusSidebar('close hoverable')
                break;
    
                case !isCloseSidebar && isHoverSidebar:
                setStatusSidebar('hoverable')
                break;
    
                case isCloseSidebar && !isHoverSidebar:
                setStatusSidebar('')
                break;
            
                default:
                setStatusSidebar('')
                break;
            }
            break;
        
            case false:
            default:
            switch (true) {
                case isCloseSidebar:
                setStatusSidebar('close')
                break;
            
                case !isCloseSidebar:
                default:
                setStatusSidebar('')
                break;
            }
            break;
        }

    }, [bigScreen, isCloseSidebar, isHoverSidebar])

    useEffect(() => {
        const handleEnterSidebar = () => setIsCloseSidebar(false)
        const handleLeaveSidebar = () => setIsCloseSidebar(true)
        const sidebarComponent = sidebarRef.current
        sidebarComponent.addEventListener('mouseenter', handleEnterSidebar)
        sidebarComponent.addEventListener('mouseleave', handleLeaveSidebar)
    })

    const handleExpandSidebar = () => {
        setIsCloseSidebar(!isCloseSidebar)
        setIsHoverSidebar(!isHoverSidebar)
    }

    const handleCloseSidebar = () => {
        setTimeout(setIsCloseSidebar(true), 300);
    }

    const MenuEnrollment = [
        {
            title: 'Tư vấn tuyển sinh 10',
            icon: <SchoolIcon />,
            onClick: () => {
                handleCloseSidebar()
                setIsOpenModalEnrollment(true)
            }
        },
        {
            title: 'Thống kê tỉ lệ chọi',
            icon: <AssessmentIcon />,
            onClick: () => {
                handleCloseSidebar()
                setIsOpenModalStatistic(true)
            }
        }
    ]

    const MenuSchool = [
        {
            title: 'Danh sách trường học',
            icon: <ListIcon />,
            onClick: () => {
                handleCloseSidebar()
                setIsOpenOffCanvasSchoolList(true)
            }
        },
        {
            title: 'Quản lý trường học',
            icon: <TopicIcon />,
            onClick: () => {
                handleCloseSidebar()
                navigate('/admin')
            }
        }
    ]
    
    return (
        <nav className={`sidebar ${statusSidebar}`} ref={sidebarRef}>
            <div className="menu-content">
                <ul className="menu-items">
                    <div className="menu-title menu-advisingenrollment"></div>
                    {MenuEnrollment.map((menu, index) => (
                        <li className="item" key={index}>
                            <button className="navlink" onClick={menu.onClick}>
                                <span className='navlink-icon'>{menu.icon}</span>
                                <span className="navlink-title"> {menu.title} </span>
                            </button>
                        </li>
                    ))}
                </ul>
                <ul className="menu-items">
                    <div className="menu-title menu-schoollist"></div>
                    {MenuSchool.map((menu, index) => (
                        <li className="item" key={index}>
                            <button className="navlink" onClick={menu.onClick}>
                                <span className='navlink-icon'>{menu.icon}</span>
                                <span className="navlink-title"> {menu.title} </span>
                            </button>
                        </li>
                    ))}
                </ul>
            {bigScreen &&
                <div className="block-content">
                    <div className='block-item expand-sidebar' onClick={() => handleExpandSidebar()}>
                        <span> Khóa tab </span>
                        <LockOpenIcon />
                    </div>
                    <div className='block-item collapse-sidebar' onClick={() => handleExpandSidebar()}>
                        <span> Đóng tab </span>
                        <LockIcon />
                    </div>
                </div>
            }
            </div>
        </nav>
    );
}

export default Sidebar;