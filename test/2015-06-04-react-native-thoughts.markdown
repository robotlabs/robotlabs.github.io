---
layout: post
title:  "React Native. Thoughts."
date:   2015-06-04 11:27:57
categories: react native
---


Introduction.
---------------------
React Native is trying to fit in the complex world of Hybrid apps. 
Apps that will be coded with less amount of work across all devices ( mainly iOS and Android ).

What we have now.
---------------------

### 1. WebView Apps.
WebView is basically a mini-browser that works as a container for your HTML, CSS and JAVASCRIPT. PhoneGap with Apache Cordova is the most famous solution for packaging your app using WebView.
You will need to use special frameworks to recreate  a native feeling ( jquery mobile, ionic etc ).
With WebView Apps, it is not easy to control native features, and these apps will never feel completely native. 
Performance will be sensibly slower than native, and the idea to have one code for web and apps is still a chimera.

### 2. Compiled Hybrid App.
[Xamarin][Xamarin_link], [Rho][Rho_link], [Corona][Corona_link] , [AIR][AIR_link] .
These tools compile your code ( js, actionscript for AIR , Lua for Corona ) into native code, so they can render directly to native views. They feel more native, and performance are almost as native. Things will change from tool to tool, but
generally a rich media app / game is doable.
You will need some pre-compiled libraries to access native features as camera, geolocation etc.

### 3. JS Runtime
React Native and Appcelerator.
React Nativbe uses native views. But there is no compile step involved. Similar to WebView, it requires an extra component, that is javascript runtime ( javascriptCore on iOS ).
So, asynchronously, this will communicate with the main native thread. This is the most important part, for performance, so the native thread won't slow down waiting for some javascript to execute.
So performance are definetely good. 

Let's focus on JS Runtime and ReactNative for now.

### PRO
Native render, native feeling. 

JS Runtime is much lighter than WebView. 

No compilation step. The workflow is brilliant. you can simply CMD + R to refresh your screen, and magically you will update your app. Compared to compiled hybrid app this looks magic.

You can use React 's architecture in your native app and it will make your code logic more similar to your web app.
You will have a a declerative, predictable UI.

Performance. delegating to main thread the rendering, things will be much faster then WebView apps, and slightly slower then pure native approach. 


### MEH 
style.
React Native team implemented CSS using flexbox in javascript as a solution for styling. 
Not sure if this is a good or bad point. For sure there are several things missing at the moment, like can't use percentage, or properties in flexbox box like grow, shrink.

### CON
You can call native classes and methods that are exposed by React Native modules, or libraries that are written in native code. This means that everytime Apple or Google will update their ecosystem, React Native will need some update to use latest features.
Last WWDC Apple released 4K new APIs. This means React Native will always be behind.

Your app will need to import JS Runtime.

A lot a lot of things missing from js world.
no canvas support for now. ( [react-native-canvas][react_native_canvas_link] doesn't work )
no camera support for now. ( some early stage experiment )
I couldn't find any support for iAD, iCloud etc.

no Android support for now, and i think it will take a while to have this working. iOS came out In February. and in June ( see above ) the situation is far from being stable. You can imagine what will happen in Android.

Animation
This subject made me cry. So far it is a disaster. You can animate states, but it doesn't look the optimal way , re-render the component every tick.
There are a few libs online, but none of them looks working properly. The React Native team suggest to use AnimationExperimental ( the name already suggest you how stable it is ). 
This works, for animating standard props, but fail if you don't specify the width and height of the element.
People are struggling. [have a look on twitter] [twitter_link].


Conclusion.
---------------------
Please take this as my strict opinion. Based on what i tested, and on some points i wrote above, i think React Native is quite far from be ready to be used in production. Lack of most common js tools ( TweenMax, canvas and pixi ), android not supported, and not a big love for React ( for now ) make me say i don't want to use this technology for now. So far it looks more work than you would with a native approach or different tools.

[Xamarin_link]:      			http://xamarin.com/
[Rho_link]:          			http://rhomobile.com/
[Corona_link]:       			https://coronalabs.com/
[AIR_link]:          			http://www.adobe.com/uk/products/air.html
[react_native_canvas_link]: 	https://www.npmjs.com/package/react-native-canvas
[twitter_link]:					https://twitter.com/ericflo/status/587742698708189184	

