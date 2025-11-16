"use client";
import React, { useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import Image from 'next/image';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';




import { Navigation, Pagination, Mousewheel, Keyboard } from 'swiper/modules';
export default function Hero(){
    return(
        <>
         <Swiper
        
        navigation={true}
        pagination={true}
        mousewheel={true}
        keyboard={true}
        modules={[Navigation, Pagination, Mousewheel, Keyboard]}
        className="mySwiper"
      >
        <SwiperSlide>
            <Image  src="/descuento.jpg"
    alt="Ofertas de tecnología"
    width={1920}
    height={800}
    className="w-full h-[400px] object-cover rounded-lg"
    priority/>
        </SwiperSlide>
        <SwiperSlide>
            <Image  src="/Gemini_Generated_Image_jwejjjwejjjwejjj.png"
    alt="Ofertas de tecnología"
    width={1920}
    height={800}
    className="w-full h-[400px] object-cover rounded-lg"
    priority/>
        </SwiperSlide>
        <SwiperSlide><Image  src="/Gemini_Generated_Image_us9rjnus9rjnus9r.png"
    alt="Ofertas de tecnología"
    width={1920}
    height={800}
    className="w-full h-[400px] object-cover rounded-lg"
    priority/>
    </SwiperSlide>
        <SwiperSlide>
 <Image  src="/supermercado.jpg"
    alt="Ofertas de tecnología"
    width={1920}
    height={800}
    className="w-full h-[400px] object-cover rounded-lg"
    priority/>
        </SwiperSlide>
      
      </Swiper>
        </>
    )
}