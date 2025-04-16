// src/hooks/useStableTag.ts
export function useStableTag() {
    const dummyTags = ['v1.0.0', 'v2.0.0', 'v1.5.0', 'v2.5.0', 'v1.6.0', 'v3.0.0'];
  
    const getMostStableTag = () => {
      const sorted = dummyTags.sort((a, b) => {
        const [ma, mb] = [a, b].map(v => v.replace('v', '').split('.').map(Number));
        return mb[0] - ma[0] || ma[2] - mb[2]; // highest major, lowest patch
      });
      return sorted[0];
    };
  
    return { getMostStableTag };
  }
  