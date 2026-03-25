Because the needs of each product that is built using Prism can vary, we have created a way for you to globally set defaults for some components. This allows you to change some specific behaviors across your whole product that you otherwise would have to do on an implementation basis. We have some different exported configs that you can utilize, or you can create your own!

## API

### `configuration`
| | |
|-----------|------------|
| Type | `object` |
| Default | `--` |
| Description | Pass either a default configuration supplied by us, or create your own. |

### `reducedMotion`
| | |
|-----------|------------|
| Type | `boolean` |
| Default | `false` |
| Description | Disabled animations within the system. |

### `colorMode`
| | |
|-----------|------------|
| Type | `**ColorMode**` |
| Default | `ColorMode.System` |
| Description | The color mode to be used by the <Theming /> component. |

### `isTestEnvironment`
| | |
|-----------|------------|
| Type | `**TestEnvironment**` |
| Default | `TestEnvironment.none` |
| Description | Used to determine if the component is being used in a test environment, and disable features that aren't supported in those environments. NOTE: if you pass any test environemnt, reducedMotion will default to true. |

### `isStaticSiteGeneration`
| | |
|-----------|------------|
| Type | `boolean` |
| Default | `false` |
| Description | Set to `true` for statically generated (SSG) pages. When enabled alongside `colorMode="system"` and a theme collection with a dark variant, Prism emits dark mode tokens using a `data-prism-theme` attribute selector instead of a `@media (prefers-color-scheme: dark)` media query. Requires an inline script to set `data-prism-theme` on `<html>` before first paint. See [Dark Mode on SSG pages](./Theming.md#dark-mode-on-statically-generated-pages-ssg) for setup instructions. |

## Exported Configurations
- CaviarConfiguration
- InternalToolsConfiguration
- MerchantNextConfiguration
- MerchantConfiguration

## What components are supported

Below is a list of the components that support global configuration, and their options.

### Modal

| Configuration | Type | Default Value |
| ------------- | ---- | ------------- |
| `closeButtonSide` | `CloseSide` | `CloseSide.leading` |
| `titleSize` | `number` | `32` |
| `useHairlineDividers` | `boolean` | `true` |

### Sidesheet

| Configuration | Type | Default Value |
| ------------- | ---- | ------------- |
| `navigationAlignment` | `NavigationAlignment` | `NavigationAlignment.leading` |
| `panelWidths` | `Record<BreakpointName, string>` | `{ mobile: '100vw', tablet: '375px', desktop: '480px', wideScreen: '560px', ultraWideScreen: '640px', }` |

### Popover

| Configuration | Type | Default Value |
| ------------- | ---- | ------------- |
| `showContainerPointer` | `boolean` | `true` |

### Logo

| Configuration | Type | Default Value |
| ------------- | ---- | ------------- |
| `Brand` | `Brand` | `Brand.DoorDash` |

### Icons

| Configuration | Type | Default Value |
| ------------- | ---- | ------------- |
| `Brand` | `Brand` | `Brand.DoorDash` |

## Usage

### Default Usage
```
<PrismWebGlobalStyles />
<Theming>
    <PrismConfig>
        <LayerManager>
        ...
        </LayerManager>
    </PrismConfig>
</Theming>
```
### With a configuration
```
<PrismWebGlobalStyles />
<Theming>
    <PrismConfig configuration={InternalToolsConfiguration}>
        <LayerManager>
        ...
        </LayerManager>
    </PrismConfig>
</Theming>
```