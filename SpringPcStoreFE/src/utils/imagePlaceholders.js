// Tech Store Image Placeholders
export const TECH_PLACEHOLDERS = {
  // Recommended image sizes for database
  MAIN_IMAGE: {
    width: 800,
    height: 600,
    ratio: "4:3"
  },
  THUMBNAIL: {
    width: 300,
    height: 225,
    ratio: "4:3"
  },
  GALLERY: {
    width: 600,
    height: 450,
    ratio: "4:3"
  },

  // Placeholder image paths
  PLACEHOLDERS: [
    "/images/products/laptop_placeholder.webp",
    "/images/products/desktop_placeholder.webp", 
    "/images/products/monitor_placeholder.webp",
    "/images/products/gpu_placeholder.webp",
    "/images/products/cpu_placeholder.webp",
    "/images/products/ram_placeholder.webp",
    "/images/products/ssd_placeholder.webp",
    "/images/products/motherboard_placeholder.webp",
    "/images/products/psu_placeholder.webp",
    "/images/products/case_placeholder.webp",
    "/images/products/cooling_placeholder.webp",
    "/images/products/peripheral_placeholder.webp"
  ],

  // Get placeholder by product category
  getPlaceholderByCategory: (categoryName) => {
    const categoryMap = {
      'laptops': 0,
      'desktop pcs': 1,
      'monitors': 2,
      'graphics cards': 3,
      'processors': 4,
      'memory (ram)': 5,
      'storage (ssd/hdd)': 6,
      'motherboards': 7,
      'power supplies': 8,
      'computer cases': 9,
      'cooling systems': 10,
      'gaming peripherals': 11
    };
    
    const index = categoryMap[categoryName?.toLowerCase()] || 0;
    return TECH_PLACEHOLDERS.PLACEHOLDERS[index];
  },

  // Get random placeholder
  getRandomPlaceholder: () => {
    const placeholders = TECH_PLACEHOLDERS.PLACEHOLDERS;
    return placeholders[Math.floor(Math.random() * placeholders.length)];
  }
};

export default TECH_PLACEHOLDERS;
