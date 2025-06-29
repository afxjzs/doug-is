# Metadata Maintenance Checklist

## Quick Reference for Metadata Implementation and Maintenance

### Adding New Static Pages

**Required Steps:**
- [ ] Create `metadata.ts` file in route directory (not route group)
- [ ] Follow title pattern: "Doug.is / PageName"
- [ ] Write description (150-160 characters)
- [ ] Create social sharing image (1200x630px)
- [ ] Add OpenGraph metadata with all required fields
- [ ] Add Twitter Card metadata
- [ ] Set canonical URL
- [ ] Write metadata validation tests
- [ ] Test social platform previews

**Metadata Template:**
```typescript
export const metadata: Metadata = {
  title: 'Doug.is / PageName',
  description: 'Compelling description (150-160 chars)',
  openGraph: {
    title: 'PageName | Doug.is',
    description: 'Same compelling description',
    url: 'https://doug.is/pagename',
    siteName: 'Doug.is',
    images: [{ url: 'https://doug.is/images/pagename.jpg', width: 1200, height: 630 }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PageName | Doug.is',
    description: 'Same compelling description',
    images: ['https://doug.is/images/pagename.jpg'],
  },
  alternates: { canonical: 'https://doug.is/pagename' },
}
```

### Adding New Dynamic Pages

**Required Steps:**
- [ ] Implement `generateMetadata` function
- [ ] Extract content for titles and descriptions from data source
- [ ] Handle fallback metadata for missing data
- [ ] Reference appropriate social images
- [ ] Set proper OpenGraph type (article/website)
- [ ] Add publishedTime and authors for articles
- [ ] Test with various content scenarios
- [ ] Validate metadata generation with test data

### Publishing New Blog Posts

**Content Checklist:**
- [ ] Post has compelling title
- [ ] Post has excerpt (or auto-generates from content)
- [ ] Featured image is provided and sized correctly (1200x630px)
- [ ] Post category is set correctly
- [ ] Published date is set

**Validation Steps:**
- [ ] Test dynamic metadata generation
- [ ] Validate social platform previews
- [ ] Check canonical URLs are correct
- [ ] Monitor social sharing after publication

### Updating Project Pages

**Update Checklist:**
- [ ] Update project descriptions for accuracy
- [ ] Create new social sharing images if needed
- [ ] Update technology metadata when stack changes
- [ ] Test project page metadata across platforms
- [ ] Validate external links in metadata

### Monthly Maintenance Tasks

**Audit Tasks:**
- [ ] Check metadata coverage across all pages
- [ ] Verify social sharing images load correctly
- [ ] Validate canonical URLs are accessible
- [ ] Review social platform requirement changes
- [ ] Monitor metadata test coverage

**Commands to Run:**
```bash
# Run metadata tests
npm test -- --testNamePattern="Metadata"

# Run full test suite with coverage
npm test:coverage

# Check specific page metadata
curl -I https://doug.is/[page-name]
```

### Quarterly Review Tasks

**Brand Consistency:**
- [ ] Review branding across all social sharing
- [ ] Update default fallback images if brand evolves
- [ ] Audit SEO performance and descriptions
- [ ] Check for new social platform requirements

### Troubleshooting Quick Fixes

**Metadata Not Showing:**
1. Check metadata is exported properly
2. Verify no TypeScript errors
3. Ensure image URLs are absolute and accessible
4. Validate against Next.js metadata requirements

**Social Previews Not Updating:**
1. Use debug tools to force refresh:
   - Twitter: https://cards-dev.twitter.com/validator
   - Facebook: https://developers.facebook.com/tools/debug/
   - LinkedIn: https://www.linkedin.com/post-inspector/
2. Add temporary query parameters to clear cache

**Image Loading Issues:**
1. Verify dimensions are exactly 1200x630px
2. Check file size is under 1MB
3. Test image URLs in incognito browser
4. Ensure images are web-optimized

### Testing Validation

**Before Deployment:**
- [ ] All metadata tests pass
- [ ] Social platform previews display correctly
- [ ] Images load properly across devices
- [ ] Canonical URLs are correct and accessible
- [ ] No console errors related to metadata

**After Deployment:**
- [ ] Test social sharing on multiple platforms
- [ ] Verify search engine indexing (for non-admin pages)
- [ ] Monitor social sharing performance
- [ ] Check analytics for improved click-through rates

### File Organization Standards

**Image Directory Structure:**
```
public/images/
├── social/
│   ├── default.jpg          # Default fallback
│   ├── building.jpg         # Section images
│   ├── thinking.jpg
│   ├── investing.jpg
│   └── projects/
│       ├── project-name.jpg # Project-specific images
```

**Test File Organization:**
```
src/components/__tests__/
├── MetadataValidation.test.tsx  # Core metadata tests
└── [PageName]Metadata.test.tsx  # Page-specific tests
```

### Performance Monitoring

**Key Metrics to Track:**
- Social sharing click-through rates
- Search engine visibility improvements
- Page load time impact (should be zero)
- Social platform compatibility scores

### Emergency Procedures

**If Social Sharing Breaks:**
1. Check recent deployments for metadata changes
2. Validate image URLs are still accessible
3. Test with social platform debug tools
4. Revert to last known working metadata if needed
5. Clear social platform caches after fix

**If SEO Performance Drops:**
1. Audit recent metadata changes
2. Check canonical URLs for duplicates
3. Verify meta descriptions haven't changed drastically
4. Monitor for any search engine guideline changes

---

*Last Updated: January 2024*
*Reference: `.cursor/rules/metadata.mdc` for detailed implementation guide* 