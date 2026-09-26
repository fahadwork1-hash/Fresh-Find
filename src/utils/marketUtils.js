// Filtering, sorting, and helper logic for markets

import { getMarketOpenStatus } from './dateUtils';
import { calculateDistanceKm } from './geoUtils';

/**
 * Filter markets based on area, day, produce, and search query
 */
export function filterMarkets({
  markets = [],
  produceList = [],
  selectedArea = 'All',
  selectedDay = 'All',
  selectedProduceId = 'All',
  searchQuery = '',
  onlyOpenNow = false,
  currentTime = new Date()
}) {
  const query = searchQuery.trim().toLowerCase();

  return markets.filter((market) => {
    // Area filter
    if (selectedArea !== 'All' && market.area !== selectedArea) {
      return false;
    }

    // Day of week filter
    if (selectedDay !== 'All') {
      const daySchedule = market.schedule?.[selectedDay];
      if (!daySchedule || !daySchedule.isOpen) {
        return false;
      }
    }

    // Produce filter
    if (selectedProduceId !== 'All') {
      if (!market.produceIds || !market.produceIds.includes(selectedProduceId)) {
        return false;
      }
    }

    // Open Now filter
    if (onlyOpenNow) {
      const status = getMarketOpenStatus(market.schedule, currentTime);
      if (!status.isOpenNow) {
        return false;
      }
    }

    // Free text search (name, area, address, description, or available produce names)
    if (query) {
      const nameMatch = market.name.toLowerCase().includes(query);
      const areaMatch = market.area.toLowerCase().includes(query);
      const addressMatch = market.address.toLowerCase().includes(query);
      const descMatch = market.description.toLowerCase().includes(query);

      // Check if query matches any produce item available in this market
      const matchingProduce = produceList.some(
        (p) =>
          market.produceIds?.includes(p.id) &&
          (p.name.toLowerCase().includes(query) || p.category.toLowerCase().includes(query))
      );

      if (!nameMatch && !areaMatch && !addressMatch && !descMatch && !matchingProduce) {
        return false;
      }
    }

    return true;
  });
}

/**
 * Sort markets based on sort criteria
 */
export function sortMarkets({
  markets = [],
  sortBy = 'alphabetical-asc', // 'alphabetical-asc' | 'alphabetical-desc' | 'proximity' | 'next-open' | 'rating'
  userCoords = null,
  currentTime = new Date()
}) {
  const list = [...markets];

  switch (sortBy) {
    case 'alphabetical-asc':
      return list.sort((a, b) => a.name.localeCompare(b.name));

    case 'alphabetical-desc':
      return list.sort((a, b) => b.name.localeCompare(a.name));

    case 'proximity': {
      if (!userCoords || !userCoords.lat || !userCoords.lng) {
        // Fallback to alphabetical if no user location
        return list.sort((a, b) => a.name.localeCompare(b.name));
      }
      return list.sort((a, b) => {
        const distA = calculateDistanceKm(
          userCoords.lat,
          userCoords.lng,
          a.coordinates?.lat,
          a.coordinates?.lng
        ) ?? Infinity;
        const distB = calculateDistanceKm(
          userCoords.lat,
          userCoords.lng,
          b.coordinates?.lat,
          b.coordinates?.lng
        ) ?? Infinity;
        return distA - distB;
      });
    }

    case 'next-open': {
      return list.sort((a, b) => {
        const statusA = getMarketOpenStatus(a.schedule, currentTime);
        const statusB = getMarketOpenStatus(b.schedule, currentTime);

        // Open now comes first
        if (statusA.isOpenNow && !statusB.isOpenNow) return -1;
        if (!statusA.isOpenNow && statusB.isOpenNow) return 1;

        // Opens today comes second
        if (statusA.isTodayOperating && !statusB.isTodayOperating) return -1;
        if (!statusA.isTodayOperating && statusB.isTodayOperating) return 1;

        // Compare offset to next open day
        const offsetA = statusA.nextOpenDayOffset ?? 99;
        const offsetB = statusB.nextOpenDayOffset ?? 99;
        return offsetA - offsetB;
      });
    }

    case 'rating':
      return list.sort((a, b) => (b.rating || 0) - (a.rating || 0));

    default:
      return list;
  }
}

/**
 * Get list of all unique areas
 */
export function getUniqueAreas(markets = []) {
  const areas = new Set(markets.map((m) => m.area));
  return ['All', ...Array.from(areas).sort()];
}
