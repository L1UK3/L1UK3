const fs = require('fs');
const path = require('path');

// Paths
const readmePath = path.join(__dirname, '../../README.md');
const techStackPath = path.join(__dirname, '../../tech-stack.json');

try {
  // Read configuration
  const techStack = JSON.parse(fs.readFileSync(techStackPath, 'utf8'));

  // Helper to generate badges
  function generateBadges(stack) {
    return stack.map(tech => {
      // URL-encode parts for Shields.io badge formatting
      const nameEscaped = encodeURIComponent(tech.name).replace(/-/g, '--');
      const colorEscaped = encodeURIComponent(tech.color);
      const logoEscaped = encodeURIComponent(tech.logo || '');
      const logoColorEscaped = encodeURIComponent(tech.logoColor || 'white');
      
      let url = `https://img.shields.io/badge/${nameEscaped}-${colorEscaped}?style=for-the-badge`;
      if (tech.logo) {
        url += `&logo=${logoEscaped}&logoColor=${logoColorEscaped}`;
      }
      return `![${tech.name}](${url})`;
    }).join('\n');
  }

  // Generate markdown blocks
  const frontendBadges = generateBadges(techStack.frontend || []);
  const backendBadges = generateBadges(techStack.backend || []);
  const devopsBadges = generateBadges(techStack.devops || []);

  // Read README.md
  let readmeContent = fs.readFileSync(readmePath, 'utf8');

  // Replace blocks
  const replaceBlock = (content, startTag, endTag, newBlock) => {
    const startIndex = content.indexOf(startTag);
    const endIndex = content.indexOf(endTag);
    
    if (startIndex === -1 || endIndex === -1) {
      console.warn(`Could not find tags ${startTag} or ${endTag}`);
      return content;
    }
    
    return content.slice(0, startIndex + startTag.length) + '\n' + newBlock + '\n' + content.slice(endIndex);
  };

  readmeContent = replaceBlock(readmeContent, '<!-- FRONTEND_BADGES_START -->', '<!-- FRONTEND_BADGES_END -->', frontendBadges);
  readmeContent = replaceBlock(readmeContent, '<!-- BACKEND_BADGES_START -->', '<!-- BACKEND_BADGES_END -->', backendBadges);
  readmeContent = replaceBlock(readmeContent, '<!-- DEVOPS_BADGES_START -->', '<!-- DEVOPS_BADGES_END -->', devopsBadges);

  // Save README.md
  fs.writeFileSync(readmePath, readmeContent, 'utf8');
  console.log('Successfully updated README.md tech stack badges!');
} catch (err) {
  console.error('Error updating badges:', err);
  process.exit(1);
}
