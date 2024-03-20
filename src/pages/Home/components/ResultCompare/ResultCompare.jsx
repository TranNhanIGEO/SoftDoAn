import "./ResultCompare.css";
import { useContext, useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { MapContext } from "src/contexts/MapContext";
import Offcanvas from "src/components/interfaces/Offcanvas/Offcanvas";

const ResultCompare = () => {
  const { isOpenOffCanvasCompare, setIsOpenOffCanvasCompare } =
    useContext(MapContext);
  const { dataResponseEnrollment } = useContext(MapContext);
  const [seriesRenderChart, setSeriesRenderChart] = useState([]);
  const [optionsRenderChart, setOptionsRenderChart] = useState({});

  useEffect(() => {
    if (!dataResponseEnrollment.length) return;
    const series = [
      {
        name: "Nguyện vọng 1",
        data: dataResponseEnrollment.map((data) => data.nv1),
      },
      {
        name: "Nguyện vọng 2",
        data: dataResponseEnrollment.map((data) => data.nv2),
      },
    ];
    const series_nv3 = {
      name: "Nguyện vọng 3",
      data: dataResponseEnrollment.map((data) => data.nv3),
    };
    const column_nv3 = dataResponseEnrollment[0]?.nv3;
    if (column_nv3) series.push(series_nv3);
    const categories = dataResponseEnrollment.map((data) => data.tentruong);
    const options = {
      chart: {
        type: "bar",
        height: 350,
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "55%",
          endingShape: "rounded",
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        show: true,
        width: 2,
        colors: ["transparent"],
      },
      xaxis: {
        categories: categories,
      },
      yaxis: {
        title: {
          text: "Điểm chuẩn",
        },
      },
      fill: {
        opacity: 1,
      },
      tooltip: {
        y: {
          formatter: function (val) {
            return val + " điểm";
          },
        },
      },
    };
    setSeriesRenderChart(series);
    setOptionsRenderChart(options);
  }, [dataResponseEnrollment]);

  return (
    <Offcanvas
      isOpen={isOpenOffCanvasCompare}
      onClose={() => setIsOpenOffCanvasCompare(false)}
      position={"centerright"}
      size={{ height: "50vh", width: "650px" }}
      style={{ overflow: "hidden" }}
    >
      <Offcanvas.Header>Biểu đồ so sánh điểm chuẩn giữa các trường</Offcanvas.Header>
      <Offcanvas.Body>
        <ReactApexChart
          options={optionsRenderChart}
          series={seriesRenderChart}
          type="bar"
          width="100%"
          height="auto"
        ></ReactApexChart>
      </Offcanvas.Body>
    </Offcanvas>
  );
};

export default ResultCompare;
