---
id: quasar
title: Why I use Quasar Framework
---
## Why I use Quasar Framework

> Quasar Framework is turning 10 this year 🎉.
>
> https://github.com/quasarframework/quasar/commit/99c6135b3c8986e915d33564851931530c6048d0

As a developer, I have always been on the lookout for tools that streamline my workflow. Back in the early days of Vue there were only a few component libraries which provided some basic functionality like buttons or cards.

Enter Quasar Framework. Initially, I thought Quasar was just another Vue component library, but my journey with it proved to be a revelation. Recently I looked up some other UI libraries, but as ten years ago, most of them miss some crucial components. For example, [daisyUI](https://daisyui.com/) looks great. I decided to check out the Date Picker component, but was unpleasantly surprised as there is none (yet, there should be with v5). Quasar Framework has had [QDate](https://quasar.dev/vue-components/date) since I started using it, which is mid 2016. The best thing about the UI components is that they are very well put together and completely customizable. The only 'downside' is that for the average user it might not be obvious on how to use this customizability. For example, there does not seem to be a minimum and maximum date limit prop on QDate, but this is easily added with the [options](https://quasar.dev/vue-components/date#limiting-options) prop.

One of the standout features of Quasar Framework is the CLI (Command Line Interface). Quasar has been way ahead of its time with the Webpack based CLI, and only with the arrival of Vite the Vue ecosystem seems to have caught up. It provides out of the box multi-platform builds and the ability to use [app extensions](https://quasar.dev/app-extensions/introduction/).

As nothing changes as fast as software development tools, I remember doubting if I made the best choice with Quasar Framework. Fortunately, nothingismagick managed to convince me with his [blog](https://medium.com/quasar-framework/how-i-joined-the-quasar-framework-team-d0671d014193), and Quasar Framework is the exception to "If it seems to good to be true, it probably is.".

Every once in a while I see a post or question like "What is the catch with Quasar?" pop up. The only two things I can think of is that it is too advanced to completely understand its capabilities, and that it might look outdated due to Material Design 2. However, the [documentation](https://quasar.dev/) is excellent and it is open-source, so if a designer steps up it is entirely possible to create a new design for Quasar.

And the answer to the yearly recurring question "What is the future of Quasar?", the answer is ["Quasar is here to stay"](https://github.com/quasarframework/quasar/discussions/17726#discussioncomment-11680751).

> Before the Quasar Team added Vite to `@quasar/cli` I tried to [create it myself](https://github.com/quasarframework/quasar/discussions/11587). This evolved into [Vitrify](https://github.com/simsustech/vitrify), which is focused on the Vite ecosystem and provides full support for the Quasar UI framework as well as support for building server side applications with Vite.
