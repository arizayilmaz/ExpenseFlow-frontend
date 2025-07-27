/**
 * Backend'den gelen data formatlarını frontend'e uygun formata dönüştüren helper fonksiyonlar
 */

export const transformBackendResponse = {
  /**
   * UUID'yi string'e dönüştür
   */
  uuid: (uuid: any): string => {
    return typeof uuid === 'string' ? uuid : String(uuid);
  },

  /**
   * BigDecimal'ı number'a dönüştür
   */
  bigDecimal: (value: any): number => {
    if (typeof value === 'number') return value;
    if (typeof value === 'string') return parseFloat(value);
    if (value && typeof value === 'object' && 'floatValue' in value) {
      return value.floatValue;
    }
    return Number(value) || 0;
  },

  /**
   * Instant'ı ISO string'e dönüştür
   */
  instant: (instant: any): string => {
    if (typeof instant === 'string') return instant;
    if (instant && typeof instant === 'object') {
      // Java Instant object format
      if ('epochSecond' in instant && 'nano' in instant) {
        const milliseconds = instant.epochSecond * 1000 + Math.floor(instant.nano / 1000000);
        return new Date(milliseconds).toISOString();
      }
    }
    // Fallback to current date if parsing fails
    return new Date().toISOString();
  },

  /**
   * Date string'i frontend formatına dönüştür
   */
  dateString: (dateStr: any): string => {
    if (!dateStr) return new Date().toISOString().split('T')[0];
    
    try {
      // Backend'den gelen tarih formatını parse et
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) {
        return new Date().toISOString().split('T')[0];
      }
      return date.toISOString().split('T')[0];
    } catch {
      return new Date().toISOString().split('T')[0];
    }
  }
};

export const transformFrontendRequest = {
  /**
   * Frontend number'ını backend BigDecimal formatına dönüştür
   */
  toBigDecimal: (value: number): number => {
    return Number(value.toFixed(2));
  },

  /**
   * Frontend date string'ini backend formatına dönüştür
   */
  toInstant: (dateStr: string): string => {
    try {
      return new Date(dateStr).toISOString();
    } catch {
      return new Date().toISOString();
    }
  }
}; 