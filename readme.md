# mapperjs

React app that renders a realtime simulation for saved GPX workouts.

## Walkthrough

Step 1 is to export your Apple Health data, the [instructions from Apple for this]([Title](https://support.apple.com/guide/iphone/share-your-health-data-iph5ede58c3d/ios)):

> You can export all of your health and fitness data from Health in XML format, which is a common format for sharing data between apps.
>
> Tap your picture or initials at the top right.
>
> If you don’t see your picture or initials, tap Summary or Browse at the bottom of the screen, then scroll to the top of the screen.
>
> Tap Export All Health Data, then choose a method for sharing your data.

I recommend AirDropping the files to your laptop.

Start the app with

```
npm i
npm run dev
```

Navigate to http://localhost:5173

Click the "choose file" button, then add in your GPX data. There are some sidebar controls:

1. Click the timestamp to play/pause
2. Drag the Playback Speed slider to increase or decrease playback speed from realtime up to 600x