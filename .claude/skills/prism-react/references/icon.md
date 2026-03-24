Icon is used for providing icon assets in code, with customizable color

## Exported Constants

* `IconBrand`
* `IconColor`
* `IconSize`
* `IconType`

## API

### `size`
| | |
|-----------|------------|
| Type | `IconSize \| number` |
| Default | `IconSize.medium` |
| Description | Choose from an enum of sizes. Can also pass through a custom number that will be applied as the height and width of the Icon. |

### `color`
| | |
|-----------|------------|
| Type | `**IconColor**` |
| Default | `IconColor.icon.default` |
| Description | Choose from an enum of Prism Colors. |

### `type`
| | |
|-----------|------------|
| Type | `**IconType**` |
| Default | `IconType.StarFill` |
| Description | Choose from an enum of types. |

### `accessibilityLabel`
| | |
|-----------|------------|
| Type | `string` |
| Default | `null` |
| Description | A text description of the icon, used to indicate this icon should be seen and read by assistive technologies, like screen readers. |

### `useDefaultColors`
| | |
|-----------|------------|
| Type | `boolean` |
| Default | `false` |
| Description | Certain icons (particularly the `Logo___` icons) have built-in default colors associated with them. Set this to `true` to use them. |

### `shouldAdjustSmallSizesWhitespace`
| | |
|-----------|------------|
| Type | `boolean` |
| Default | `undefined` |
| Description | There is an existing quirk between our design assets and the SVGs leveraged by the `<Icon />` component where the presence of a containing bounding box causes the actual icon content to render with excessive whitespace for size `Small` and smaller `Icon`s. We have provided this opt-in prop to remove that excessive visual whitespace via CSS until we are able to resolve the discrepancy upstream in a future major version of Prism Web. |

## Usage

### Default Icon
```typescript
import { Icon, IconType } from '@doordash/prism-react'
…
<Icon type={IconType.Search} />
<input type="search" />
```
### Icon with size, color specified
```typescript
import { Icon, IconSize, IconColor, IconType } from '@doordash/prism-react'
…
<Icon
  size={IconSize.large}
  color={IconColor.brand.primary}
  type={IconType.Add}
/>
```
### Icon with default colors used specified
```typescript
import { Icon, IconSize, IconType } from '@doordash/prism-react'
…
<Icon
  size={IconSize.large}
  type={IconType.LogoGoogle}
  useDefaultColors
/>
```
### Provide an accessibilityLabel
```typescript
import { Icon, IconSize, IconType } from '@doordash/prism-react'
…
<Icon
  size={IconSize.large}
  type={IconType.LogoGoogle}
  useDefaultColors
  accessibilityLabel="Open Google Play Store"
/>
```
### Use CurrentColor to take color context from container
If you need the icon to take on the current color of it's context (especially with hover/active states also handled) you should consider using `IconColor.currentColor` so that you don't need explicit handling of the color or how it changes given state.

For example, in the code below, the containing, decorative text is `usage.action.primary.default`, then on Hover is `usage.action.primary.hovered`, and on active is `usage.action.primary.active`.
```typescript
import { Icon, IconSize, IconType, IconColor, Button, ButtonType } from '@doordash/prism-react'

<Button type={ButtonType.flatPrimary}>
  <Icon
    size={IconSize.large}
    type={IconType.ArrowRight}
    color={IconColor.currentColor}
    accessibilityLabel="Next"
  />
</Button>
```
## Available IconType Values

512 non-deprecated icons. Most come in `Fill` (solid) and `Line` (outline) variants.
Use `IconType.<Name>` for the `type` prop, e.g. `type={IconType.HomeLine}`.

> To find an icon, grep this file for the concept term, e.g. `grep -i "cart" references/icon.md`

AccessibilityLine
Add
AddCircleLine
AirPumpLine
AlcoholLine
AlignTopLine
ApartmentLine
ArrowDown
ArrowDownLeft
ArrowDownRight
ArrowHorizontalVertical
ArrowLeft
ArrowRedo
ArrowRight
ArrowTrendingUp
ArrowTurnLeft
ArrowTurnRight
ArrowUndo
ArrowUp
ArrowUpLeft
ArrowUpRight
BabyALine
BabyBLine
BackpackLine
BackspaceLine
BadgeALine
BadgeBLine
BadgeCLine
BadgeDLine
BakeryLine
BalloonsLine
BarChart
BaseballLine
BasketballLine
BeakerLine
BeautyLine
BenefitsDashpassColor
BenefitsDoordashColor
BidLine
BoltLine
BookmarkFill
BookmarkLine
BoxLine
BriefcaseAddLine
BriefcaseLine
BrowseTabLine
CalendarFill
CalendarLine
CameraAddLine
CameraLine
CanadaMapleLeafFill
CardAmexColor
CardAmexMonocolor
CardApplePayColor
CardApplePayMonocolor
CardCashappColor
CardCashappMonocolor
CardCaviarColor
CardCaviarMonocolor
CardChaseColor
CardChaseMonocolor
CardDashpassColor
CardDashpassMonocolor
CardDinersClubColor
CardDinersClubMonocolor
CardDiscoverColor
CardDiscoverMonocolor
CardDoordashColor
CardDoordashColorLine
CardDoordashMonocolor
CardDoordashRewardsColor
CardDoordashRewardsMonocolor
CardFill
CardGooglePayColor
CardGooglePayMonocolor
CardIdFill
CardIdLine
CardLine
CardLoyaltyFill
CardLoyaltyLine
CardMastercardColor
CardMastercardMonocolor
CardPaypalColor
CardPaypalMonocolor
CardVenmoColor
CardVenmoMonocolor
CardVisaColor
CardVisaMonocolor
CaretDown
CaretLeft
CaretRight
CaretUp
CartAddLine
CartLine
CaseLine
CatLine
CateringLine
Caviar
CbdThcLine
CertifiedCheckLine
Challenge
ChannelLine
ChatConversation
ChatDefaultLine
Check
CheckCircleLine
CheckFinancialFill
CheckFinancialLine
CheckSquareLine
CheckSquareOffLine
ChevronDown
ChevronLeft
ChevronRight
ChevronUp
CityHopperLine
ClocheLine
Close
ClothesLine
CoffeeLine
ContactlessDeliveryLine
ConvenienceLine
CookingLine
CopyLine
CropLine
DashaiLine
DashboardLine
DashmartLine
DashpassSingleTokenFill
DashpassToken1Fill
DashpassToken2Fill
DashpassToken3Fill
DashpassToken4Fill
DashpassToken5Fill
DashpassToken6Fill
DashpassToken7Fill
DashpassToken8Fill
DashpassToken9Fill
DashpassToken9plusFill
DealsBlackFridayLine
DealsLine
DeliLine
DeliveryDiscountLine
DeliveryTruckLine
DessertLine
DevicePhone
DevicePosLine
DeviceTablet
DiamondLine
DirectionsLine
DocReviewLine
DockDownLeftLine
DockDownRightLine
DockLeftLine
DockRightLine
DockUpLeftLine
DockUpRightLine
DogLine
DownloadLine
DrinkStrawLine
DroneLine
DrugstoreLine
EditAddLine
EditLine
EmailLine
ErrorLine
EyeHiddenLine
EyeVisibleLine
EyedropperLine
FavoriteFill
FavoriteLine
FavoritesLine
FigmaFill
FigmaLine
FilterFill
FilterLine
FireLine
FitnessLine
FlagLine
FlashlightAutoFill
FlashlightDisabledFill
FlashlightEnabledFill
FlowerLine
FolderLine
FoodBowlLine
FoodLine
FootballLine
FrontDeskLine
FuelElectricLine
FuelGasLine
FunnelLine
GiftCardLine
GiftLine
GlobeLine
GridLine
GroceryLine
HalfCircleLeft
HalfCircleRight
HalfLine
HandLine
HeadsetLine
HeavyLine
HelpCircleFill
HelpCircleLine
HelpLifesaver
History
HolidayGiftLine
HomeFill
HomeLine
HospitalLine
HourglassDisabledLine
HourglassOffLine
HourglassOnLine
IceCreamLine
InfoLine
InsightLine
KeyLine
LampLine
LanguageLine
LateNightLine
LineChart
Link
LinkBroken
LinkExternalLine
List
LocalExpertLine
LocationFarLine
LocationGpsLine
LocationHistory
LocationNearLine
LocationPinEnabledLine
LocationPointerLine
LockedLine
LogoAdtColor
LogoAdtMonocolor
LogoAfterpay
LogoAfterpayColor
LogoAfterpayMonocolor
LogoAndroid
LogoApple
LogoBrexColor
LogoBrexMonocolor
LogoCashappColor
LogoCashappMonocolor
LogoChase
LogoCheckrColor
LogoCheckrMonocolor
LogoConcurColor
LogoConcurMonocolor
LogoCourierColor
LogoCourierMonocolor
LogoDasherColor
LogoDasherMonocolor
LogoDashpass
LogoDashpassMonocolor
LogoDashpassNew
LogoDashpassNewMonocolor
LogoDashpassPurpleColor
LogoDoordash
LogoEaterColor
LogoEaterMonocolor
LogoEmburseColor
LogoEmburseMonocolor
LogoExpensifyColor
LogoExpensifyMonocolor
LogoFacebook
LogoGithubColor
LogoGithubMonocolor
LogoGlassdoor
LogoGoogle
LogoGoogleMapsColor
LogoGoogleMapsMonocolor
LogoInfatuationColor
LogoInfatuationMonocolor
LogoInstagram
LogoKlarnaColor
LogoKlarnaMonocolor
LogoLineColor
LogoLineMonocolor
LogoLinkedin
LogoMedium
LogoMerchantColor
LogoMerchantMonocolor
LogoMichelinColor
LogoMichelinMonocolor
LogoOpentableColor
LogoOpentableMonocolor
LogoPaypayColor
LogoPaypayMonocolor
LogoPersonaColor
LogoPersonaMonocolor
LogoRampColor
LogoRampMonocolor
LogoRedditColor
LogoRedditMonocolor
LogoResyColor
LogoResyMonocolor
LogoSalesforceColor
LogoSalesforceMonocolor
LogoSiftColor
LogoSiftMonocolor
LogoSnapEbtColor
LogoSnapEbtMonocolor
LogoSnapchatMonocolor
LogoSodpColor
LogoSodpMonocolor
LogoSquare
LogoStripeColor
LogoStripeMonocolor
LogoTabelogColor
LogoTabelogMonocolor
LogoThrillistColor
LogoThrillistMonocolor
LogoTiktokColor
LogoTiktokMonocolor
LogoToastColor
LogoToastMonocolor
LogoTockColor
LogoTockMonocolor
LogoTripadvisorMonocolor
LogoTwitter
LogoVenmo
LogoWazeColor
LogoWazeMonocolor
LogoWebhooks
LogoWhatsappColor
LogoWhatsappMonocolor
LogoX
LogoYelpColor
LogoYelpMonocolor
LogoYoutubeColor
LogoYoutubeMonocolor
LogoZohoColor
LogoZohoMonocolor
LogoutLine
LoyaltyLine
MapLine
MaskLine
MealBoxLine
MedicalLine
Menu
MenuEditLine
MerchantLine
MicrophoneLine
MiscellaneousLine
MoneyBank
MoneyCashLine
MoneyCircleEnabledFill
MoneyCircleEnabledLine
MoneyDefault
MoneyEuro
MoneyEuroCircleEnabledLine
MoreHorizontal
MoreVertical
MothersDayLine
MoviesLine
NewYearsEveLine
NoUtensilsLine
NotebookLine
NotesLine
NotifyLine
Number1Line
Number2Line
Number3Line
Number4Line
Number5Line
Number6Line
Number7Line
Number8Line
Number9Line
OfficeLine
OrderBagLine
OrderBatchLine
OrderLargeLine
OrderLargeLineFrCa
OrderMediumLine
OrderSmallLine
OrderSmallLineFrCa
ParkingEsMxLine
ParkingLine
PartyLine
PauseLine
PaymentLine
PeopleAddLine
PeopleGroupLine
PersonFindLine
PersonProfileLine
PersonUserFill
PersonUserLine
PetsLine
PharmacyLine
PhotoFlipLine
PhotoLine
PhotoRotateLine
PhotoUploadLine
PhotosLine
PizzaLine
PlayLine
PluginLine
PrintLine
PrismFill
PrismLine
ProhibitedLine
PromoBullhornLine
PromoLine
RadioOffCircleLine
RadioOnCircleFill
RateDasherLine
RearrangeVertical
ReceiptCancelOrderLine
ReceiptLine
RetailLine
RewardLine
Rotate
RunTestLine
SafetyLine
SaltShakerLine
Scale
Scan
ScrewLine
SearchLine
SeatFill
SeatLine
SendLine
SettingsLine
ShareLine
ShelfLine
ShieldCheckLine
ShieldHeartLine
SidewalkRobotLine
SignalError
SignalHigh
SignalLow
SignalMedium
SkewHorizontalLine
SkewVerticalLine
SmileyHappyLine
SmileyNeutralLine
SmileySadLine
Sort
SortOrder
Sos
SpellingLine
SprayBottleLine
StPatricksDayLine
StarFill
StarHalf
StarLine
StatusDotClosedColor
StatusDotClosedMonocolor
StatusDotDeactivatedColor
StatusDotDeactivatedMonocolor
StatusDotDriveColor
StatusDotDriveMonocolor
StatusDotInactiveColor
StatusDotInactiveMonocolor
StatusDotOpenColor
StatusDotOpenMonocolor
StatusDotPausedColor
StatusDotPausedMonocolor
StopLine
Subtract
SubtractCircleLine
SunLine
Swap
Sync
TableLine
TaskLine
ThanksgivingTurkeyLine
ThreeDayWeekendLine
ThumbsDownFill
ThumbsDownLine
ThumbsUpFill
ThumbsUpLine
TicketLine
TimeLine
TipsStaffLine
ToiletLine
ToiletPaperLine
ToteBarcodeLine
ToteLine
ToysLine
TrashLine
TrophyLine
TvAwardsLine
TvLine
TvPlayLine
UnlockedLine
UploadLine
ValentinesDayLine
VehicleAirplaneLine
VehicleBikeLine
VehicleCarLine
VehicleEbikeLine
VehicleMotorcycleLine
VehicleScooterLine
VehicleWalk
VideoLine
VideoUploadLine
ViewCollapse
ViewExpand
VolumeHighLine
VolumeLowLine
VolumeMuteLine
VolumeNoneLine
WalletTicketLine
WarningLine
WheelchairFill
WheelchairLine
WineLine
WrenchLine
ZoomInLine
ZoomOutLine