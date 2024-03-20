import "./ResultStatistic.css";
import { useContext, useMemo } from "react";
import ReactApexChart from "react-apexcharts";
import { MapContext } from "src/contexts/MapContext";
import Offcanvas from "src/components/interfaces/Offcanvas/Offcanvas";

const ResultStatistic = () => {
  const { isOpenOffCanvasStatistic, setIsOpenOffCanvasStatistic } =
    useContext(MapContext);
  const { dataResponseStatistic } = useContext(MapContext);
  const bigScreen = window.innerWidth > 768;

  const seriesRenderChart = useMemo(() => {
    const slnv1 = dataResponseStatistic?.map((dt) => dt.slnv1);
    const ctieu = dataResponseStatistic?.map((dt) => dt.ctieu);
    const competitiveRates = dataResponseStatistic?.map((dt) =>
      ((dt.slnv1 / dt.ctieu) * 100).toFixed()
    );
    return [
      {
        name: "Tổng số thí sinh đăng ký",
        type: "column",
        data: slnv1,
      },
      {
        name: "Tổng số chỉ tiêu",
        type: "column",
        data: ctieu,
      },
      {
        name: "Tỉ lệ chọi",
        type: "line",
        data: competitiveRates,
      },
    ];
  }, [dataResponseStatistic]);

  const optionsRenderChart = useMemo(() => {
    const year = dataResponseStatistic?.map((dt) => dt.namtuyensinh);
    const name = dataResponseStatistic?.[0]?.tentruong;
    return {
      chart: {
        type: "line",
        stacked: false,
        toolbar: {
          show: true,
          tools: {
            download: true,
            zoom: false,
            zoomin: false,
            zoomout: false,
            pan: false,
            selection: false,
            reset: false,
          },
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        width: [1, 1, 4],
      },
      title: {
        text: name,
        align: "center",
      },
      xaxis: {
        categories: year,
      },
      yaxis: [
        {
          axisTicks: {
            show: true,
          },
          axisBorder: {
            show: true,
            color: "#008FFB",
          },
          labels: {
            style: {
              colors: "#008FFB",
            },
          },
          title: {
            text: "Số lượng đăng ký (học sinh)",
            style: {
              color: "#008FFB",
            },
          },
          tooltip: {
            enabled: true,
          },
        },
        {
          seriesName: "Tổng số thí sinh đăng ký",
          opposite: true,
          axisTicks: {
            show: true,
          },
          axisBorder: {
            show: true,
            color: "#00E396",
          },
          labels: {
            style: {
              colors: "#00E396",
            },
          },
          title: {
            text: "Số lượng chỉ tiêu (học sinh)",
            style: {
              color: "#00E396",
            },
          },
        },
        {
          seriesName: "Tỉ lệ chọi",
          opposite: true,
          axisTicks: {
            show: true,
          },
          axisBorder: {
            show: true,
            color: "#FEB019",
          },
          labels: {
            style: {
              colors: "#FEB019",
            },
          },
          title: {
            text: "Tỉ lệ chọi (%)",
            style: {
              color: "#FEB019",
            },
          },
        },
      ],
      tooltip: {
        fixed: {
          enabled: true,
          position: "topLeft",
          offsetY: 35,
          offsetX: 75,
        },
      },
      legend: {
        horizontalAlign: "center",
      },
    };
  }, [dataResponseStatistic]);

  return (
    <Offcanvas
      isOpen={isOpenOffCanvasStatistic}
      onClose={() => setIsOpenOffCanvasStatistic(false)}
      position={bigScreen ? "centerleft" : "center"}
      size={
        bigScreen
          ? { height: "45vh", width: "500px" }
          : { height: "35vh", width: "350px" }
      }
      style={{ overflow: "hidden" }}
    >
      <Offcanvas.Header>Biểu đồ thống kê tỉ lệ chọi</Offcanvas.Header>
      <Offcanvas.Body>
        <ReactApexChart
          options={optionsRenderChart}
          series={seriesRenderChart}
          type="line"
          width="100%"
          height="auto"
        ></ReactApexChart>
      </Offcanvas.Body>
    </Offcanvas>
  );
};

export default ResultStatistic;
