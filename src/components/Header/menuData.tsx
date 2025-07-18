import { Menu } from "@/types/menu";

const menuData: Menu[] = [
  {
    id: 1,
    title: "Home",
    path: "/",
    newTab: false,
  },
  {
    id: 2,
    title: "더오름 이앤씨",
    newTab: false,
    submenu: [
      {
        id: 21,
        title: "소개",
        path: "/about",
        newTab: false,
      },
      // {
      //   id: 22,
      //   title: "연혁",
      //   path: "/history",
      //   newTab: false,
      // },
      {
        id: 23,
        title: "조직도",
        path: "/orgChart",
        newTab: false,
      },
      {
        id: 24,
        title: "오시는길",
        path: "/location",
        newTab: false,
      },
    ]
  },
  {
    id: 3,
    title: "사업분야",
    newTab: false,
    submenu: [
      {
        id: 31,
        title: "TOR 자립식 옹벽",
        path: "/buField1",
        newTab: false,
      },
      {
        id: 32,
        title: "절토부옹벽",
        path: "/buField2",
        newTab: false,
      },
      {
        id: 33,
        title: "보강토 옹벽",
        path: "/buField3",
        newTab: false,
      },
      {
        id: 34,
        title: "중력식 옹벽",
        path: "/buField4",
        newTab: false,
      },
      {
        id: 35,
        title: "경관 옹벽",
        path: "/buField5",
        newTab: false,
      },
    ]
  },
  {
    id: 4,
    title: "시공실적",
    path: "/construction",
    newTab: false
  },
];
export default menuData;
