"use client"

import { useEffect, useState } from 'react';

function KakaoMap() {
  useEffect(() => {
    const mapScript = document.createElement('script');

    mapScript.async = true;
    mapScript.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=2e69b7957989b1b8bc7df9b29b35ec19&autoload=false`;

    document.head.appendChild(mapScript);

    const onLoadKakaoMap = () => {
      window.kakao.maps.load(() => {
        const mapContainer = document.getElementById('map');
        const mapOption = {
          center: new window.kakao.maps.LatLng(37.61382082079189, 127.15202838932244), // 지도의 중심좌표
          level: 3, // 지도의 확대 레벨
        };

        const map = new window.kakao.maps.Map(mapContainer, mapOption);

        const markerPosition  = new window.kakao.maps.LatLng(37.61382082079189, 127.15202838932244);
                
        // 결과값을 마커로 표시
        const marker = new window.kakao.maps.Marker({
            position: markerPosition,
            title: '더오름 이앤씨', // 마커의 타이틀
            clickable: true // 마커를 클릭했을 때 지도의 중심을 이동할 수 있도록 설정
        });
        
        // 지도의 중심을 결과값으로 받은 위치로 이동
        marker.setMap(map);
      });
    };
    mapScript.addEventListener('load', onLoadKakaoMap);
  }, []);

  return (
    <div id="map" style={{ width: "100%", height: "560px", border: "1px solid #888" }}></div>
  );
}

export default KakaoMap;