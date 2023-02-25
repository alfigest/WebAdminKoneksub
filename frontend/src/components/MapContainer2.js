import React, { useEffect, useState, useRef } from 'react'
import { Wrapper,  Status } from '@googlemaps/react-wrapper'
import useDeepCompareEffectForMaps from 'use-deep-compare-effect'

const mapStyles = {
  width: '100%',
  height: 'auto'
}

interface MapProps extends google.maps.MapOptions {
  style: { [key: string]: string };
  onClick?: (e: google.maps.MouseEvent) => void;
  onIdle?: (map: google.maps.Map) => void;
}

const Marker = (options) => {
  const [marker, setMarker] = useState()

  useEffect(() => {
    if (!marker) {
      setMarker(new google.maps.Marker())
    }

    return () => {
      if(marker){
        marker.setMap(null)
      }
    }
  }, [marker])

  useEffect (() => {
    if (marker) {
      marker.setOptions(options)
    }
  }, [options, marker])

  return null
}

const Map: React.FC<MapProps> = ({
  style,
  onClick,
  onIdle,
  children,
  ...options 
}) => {
  const ref = useRef(null)
  const [map, setMap] = useState(null)

  useEffect(() => {
    if(ref.current && !map){
      setMap(new window.google.maps.Map(ref.current, {}))
    }
    if(map){
      ["click", "idle"].forEach((event) =>
        google.maps.event.clearListeners(map, event)
      );

      if(onClick){
        map.addListener("click", onClick)
      }

      if(onIdle){
        map.addListener("idle", () => onIdle(map))
      }
    }
  }, [ref, map, onClick, onIdle])

  useDeepCompareEffectForMaps(() => {
    if(map){
      map.setOptions(options)
    }
  }, [options, map])

  return (
    <>
      <div ref={ref} style={style} />
      {React.Children.map(children, (child) => {
        if(React.isValidElement(child)){
          return React.cloneElement(child, {map})
        }
      })}
    </>
  )
}

export default function MapContainer({setLatitudeLongitude, latLng}) {
  const [clicks, setClicks] = useState([])
  const [zoom, setZoom] = useState(12)
  const [center, setCenter] = useState({lat: -7.257833394913394, lng: 112.75203690996337})

  useEffect(() => {
    setClicks([latLng])
  }, [latLng])

  const onClick = (e) => {
    setClicks([e.latLng])
    setLatitudeLongitude(e.latLng)
    console.log(e.latLng)
    console.log(typeof(e.latLng))
  }

  const onIdle = (map) => {
    setZoom(map.getZoom())
    setCenter(map.getCenter().toJSON())
  }

  const render = (status: Status) => {
    return <h1>{status}</h1>
  };

  return(
    <Wrapper apiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY} render={render}>
      <Map center={center} zoom={zoom} onClick={onClick} onIdle={onIdle}>
        {clicks.map((latLng, i) => (
          <Marker key={i} position={latLng} />
        ))}
      </Map>
    </Wrapper>
  )
}
