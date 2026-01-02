export const getSlicePath = (
  index: number, 
  total: number, 
  innerRadius: number, 
  outerRadius: number, 
  cx: number = 144, 
  cy: number = 144
) => {
  const angleStep = 360 / total;
  const startAngle = (index * angleStep) - 90;
  const endAngle = ((index + 1) * angleStep) - 90;
  
  const polarToCartesian = (angle: number, radius: number) => {
    const rad = (angle * Math.PI) / 180.0;
    return {
      x: cx + (radius * Math.cos(rad)),
      y: cy + (radius * Math.sin(rad))
    };
  };

  const p1 = polarToCartesian(startAngle, outerRadius);
  const p2 = polarToCartesian(endAngle, outerRadius);
  const p3 = polarToCartesian(endAngle, innerRadius);
  const p4 = polarToCartesian(startAngle, innerRadius);

  const largeArcFlag = angleStep > 180 ? 1 : 0;

  return `M ${p1.x} ${p1.y} A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 1 ${p2.x} ${p2.y} L ${p3.x} ${p3.y} A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${p4.x} ${p4.y} Z`;
};