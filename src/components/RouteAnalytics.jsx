import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { trackPageView } from '../utils/analytics';

export default function RouteAnalytics() {
  const location = useLocation();
  const lastTrackedPath = useRef(null);

  useEffect(() => {
    const routeKey = `${location.pathname}${location.search}${location.hash}`;
    if (lastTrackedPath.current === routeKey) return;

    lastTrackedPath.current = routeKey;
    trackPageView(location);
  }, [location]);

  return null;
}
