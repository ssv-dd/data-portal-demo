# `ResponsivePicture`
The ResponsivePicture component uses PICTURE, SRCSET and IMG tags to render images that are automatically optimized for size and pixel density of the browser.

The optimization process uses the properties you supply to optimize and does not rely on measuring the device/browser properties at runtime. Thus is works equally well in server or client side rendering components.

The component follows the philosophy of separating content and layout and thus no padding, margin or aspect ratio related properties. You should construct frames as appropriate for you needs to contain instances of this component which style themselves to 100% width and height of the container.

Image sizes are optimized for specific viewport widths or specific sizes on a per breakpoint basis. This means you can specify a different optimal size for the image at each of the Prism breakpoints [Mobile, Tablet, Desktop, WideScreen]. The optimal size of the image at each breakpoint can be specified either with an explicit pixel width ( using the fixedWidths property ) or as a percentage of the viewport width ( using the viewportPercentages property ).

The component supports the same image formats as our current CDN solution. You can specify jpeg, webp, avif, json, png or auto as a format. Some browser may not support the desired format but the component will not detect or correct for this.

For lossy formats ( jpeg, webp, avif ) you can specify the quality of the resulting image allowing you to trade visual quality for size. The default of 72 is reasonable for most content, especially food where sharp edges or fine color gradients are not typically present.

The SRCSET for each image support 1x and 2x pixel densities which allows the browser to select the most appropriate for the current display. 3x or more can easily be added but the ROI is questionable for typical DoorDash photography ( a 3x image will be 4 times larger than the equivalent 2x image ).

## Image Sources
The component uses the `https://img.cdn4dd.com/p/` resize service to load assets optimized for your use case. **Your image(s) must be in the `doordash-static` bucket**, as the `/p` resize service sources images from this bucket. Additionally, the component will parse the URL provided for the path to the asset within the `doordash-static` bucket. Ideally URLs should be provided using the `https://img.cdn4dd.com/s` endpoint (e.g. `https://img.cdn4dd.com/s/media/photos/53c484b0-ad7d-4152-a52e-5e81e1494e5c-retina-large-jpeg`). [You can read more about the `img.cdn4dd` endpoints in the Traffic Wiki](https://doordash.atlassian.net/wiki/spaces/Eng/pages/2042955091/CDN+-+Traffic). While using the `/s` endpoint is preferred, the component is also able to parse other domains that pull assets from `doordash-static`.
```
// Static urls
https://img.cdn4dd.com/s/media/photos/53c484b0-ad7d-4152-a52e-5e81e1494e5c-retina-large-jpeg
https://cdn.doordash.com/media/photos/53c484b0-ad7d-4152-a52e-5e81e1494e5c-retina-large-jpeg
https://doordash-static.s3.amazonaws.com/media/photos/53c484b0-ad7d-4152-a52e-5e81e1494e5c-retina-large-jpeg

// Images that have already been resized through one of the resize services may also be provided:
https://img.cdn4dd.com/p/fit=contain,format=auto/media/photos/f478815d-b7c5-4088-994d-2af04a5ffdcf-retina-large.png
https://img.cdn4dd.com/cdn-cgi/image/fit=contain,width=300,format=auto,quality=50/https://cdn.doordash.com/media/photos/f478815d-b7c5-4088-994d-2af04a5ffdcf-retina-large.png
https://img.cdn4dd.com/r/fit=contain,width=640,format=auto,quality=50/https://cdn.doordash.com/media/photos/f478815d-b7c5-4088-994d-2af04a5ffdcf-retina-large.png
```
In any of these cases the source URL should be parsed out and transformed to create an optimal SRCSET for the component. This allows you to use the component with APIs that come with transformed image URLs from the backend.

## Responsive Sizing Details
The component is optimized for width calculations. If you do not specify our height our CDN will return an image with the same aspect ratio as the source image. Specifying the optional height parameter will return an image clamped to the height specified which is typically only useful for letterbox sized inserts and promotional images.

Properties that are configured per breakpoint ( fixedWidths, viewportPercentages ) accept a ResponsivePictureBreakpointConfiguration object which has the following shape
```typescript
type ResponsivePictureBreakpointConfiguration = {
  Mobile: number
  Tablet: number
  Desktop: number
  WideScreen: number
}
```
## API
Prop | PropType | Default | Notes
---- | -------- | ------- | -----
`baseURL` `required` | `string` | `""` | The source URL for the image. The URL contain an existing transformation which will be removed.
`quality` | `number` | `72` | For lossy formats the quality required 1=>100
`objectFit` | `'cover' OR 'contain' OR 'fit' OR 'none' OR 'scale-down'` | `contain` | CSS object-fit parameter applied to the IMG tag
`objectPosition` | `string` | `50% 50%` | CSS object-position parameter applied to the IMG tag
`format` | `'jpeg' OR 'webp' OR 'avif' OR 'png' 'json' OR 'auto'` | `jpeg` | transformed image format. Your source format can be different than the transformed / optimized format
`loading` | `'lazy' OR 'eager'` | `lazy` | Lazy permits the browser to defer loading to the most appropriate time at the browsers discretion.
`viewportPercentages` | `ResponsivePictureBreakpointConfiguration` | `none` | Specify the percentage of viewport width to use for the image at each breakpoint. For a full width image using 100 and so on. This is useful for images that might be resized with viewport size changes.
`fixedWidths` | `ResponsivePictureBreakpointConfiguration` | `none` | The exact width of images at each breakpoint. If images do not resize this is property to use. Simply specify the maximum pixel width of the image at each breakpoint
`height` | `number OR ResponsivePictureAspectRatio` | `none` | Clamp the image to a specific height. Our current CDN solution usually selects the vertical center of the image to crop around.
`maximumDensity` | `number` | `2` | Sets the maximum pixel density for which image URLS will be generated and added to the srcset
`alt` `required` | `string` | `none` | The mandatory alt text for the image.
`onError` | `() => void` | `none` | Optional callback invoked when the image fails to load. Useful for implementing fallback behavior (e.g., falling back to an original URL when a variant image doesn't exist on the CDN).

## Usage

### ResponsivePicture - default state
```typescript
import { ResponsivePicture } from '@doordash/prism-react'

/*
  The image has a fixed sized at each breakpoint
*/
const HeroHeight = 400
<ResponsivePicture
    baseURL={storeImage}
    loading="eager"
    fixedWidths={{
        Mobile: 300,
        Tablet: 700,
        Desktop: 960,
        WideScreen: 960,
    }}
    height={HeroHeight}
    objectFit="cover"
    alt={storeName}
/>
```
### ResponsivePicture - advanced configurations
```typescript
import { ResponsivePicture } from '@doordash/prism-react'

/*
  The images are arranged in a grid which is 1 up for mobile ( 100% width ) 2 up for tablet ( 50% width )
  4 up for desktop ( 25% width ) and 5 up for desktop wide ( 20% width )
*/
<ResponsivePicture
    baseURL={imageURL}
    loading="lazy"
    viewportPercentages={{
        Mobile: 100,
        Tablet: 50,
        Desktop: 25,
        WideScreen: 20,
    }}
    alt={imageURL}
    format={'jpeg'}
    objectFit="contain"
/>

/*
  A hero image picture, which is 90vw at all breakpoints but clamped to only 250px high.
  Additionally the objectPosition is set of left, top to keep the cropping focus at the left/top quadrant
  of the image
*/
<ResponsivePicture
    baseURL={heroURL}
    viewportPercentages={{
        Mobile: 90,
        Tablet: 90,
        Desktop: 90,
        WideScreen: 90,
    }}
    height={250}
    objectFit="cover"
    alt="picture"
    objectPosition="left top"
/>
```
### Usage tips
* Inspect your images with the debugger and examine the .currentSrc property for the image to ensure you are getting the size of image you expect.
* Be careful when debugging since the browser is knowledgable about its cache contents and will load larger images than necessary if it knows that are already present in the cache. Debug with the cache disabled and a full refresh to be sure you are seeing the image intended for a given viewport configuration.
* This component expects to be placed with a container that is fully responsible for the image within it. Construct your own flexible or fixed size container.

### Future Work

This component was used in conjunction with an SSR prototype and has a feature set only as required to complete the prototype. Future updates might include
* More flexible height properties
* Callback property for load events (`onError` is supported; load success callback is not yet available)
* It might be possible to use the User-Agent request header / browser property to determine if the given device supports `webp` or `avif` format and substitute this automatically
* In development environment ( localhost ) color tint the images to indicate if they are excessively large or small for their container.