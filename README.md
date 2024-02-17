## Welcome to Super Simple Headless CMS!

Super Simple Headless CMS is exactly what it sounds like... a Super Simple Headless CMS! Do you need a Super Simple Headless CMS that's simple enough for one person to manage but still complex enough to handle
semi-complex state and diverse asset management paired with a powerful global CDN... well, guess what, with Super Simple Headless CMS, that's what you get!

A Next.js app utilizing ChakraUI, powered by MongoDB and Mongoose ODM, with asset management handled by AWS S3 and support for CloudFront CDN built-in.

## Quick Start

If you haven't already, install the latest versions of docker and docker compose.
For WSL users, make sure you have docker-compose-plugin installed. Make sure to create a docker group and add yourself as a user if you haven't already, docs here: https://docs.docker.com/engine/install/linux-postinstall/ Make sure to login. If you're getting "pass store is not initialized", try this solution: https://stackoverflow.com/a/73558624/13836220 

Then:

1. Clone this repo
3. From the root of the project run `npm run docker`
4. Go to http://localhost:3000/admin and create your first admin

http://localhost:3000 is your homepage... and that's it! That's all you need to do to get started.

**NOTE:** You will need to have node and npm installed locally to develop. After you install these, from the root of the repo, run `npm install`.

There are a few example Templates that have been left in the base repo. Try adding a Photo List Template to the root `/` page:
1. In /admin/manage-pages, click the "edit" button for the `/` page.
2. Find "Create New Templates" button, click.
3. Select "Photo List" type.
4. Find "Create New Assets", click.
5. Select "Image" type.
6. Choose your image file.
7. Add any title or description text that you'd like.
8. Click "Save", you'll be taken back to the Template, your new Asset has been automatically added to the Template "Assets".
9. Click "Save" again, you'll be taken back to the `/` page, your new Template has been automatically added to the Page "Templates".
10. Click "Update", you'll be taken back to manage-pages.
11. Visit the root home page at `http://localhost:3000` and see your asset displayed!

To add a new page, simply select "Create New Page" in /admin/manage-pages and repeat the above process for any Template and Asset. You'll see your new Page added to the Navbar. Try it out!

## Quick Summary

Super Simple Headless CMS is built on a Page -> Template -> Asset model. You create Pages that have Templates that are filled with Assets. You can either
update existing pages or create new ones. Drag and drop to rearrange order.

- Note: Nested pages are not yet supported.

When you add a page, it'll be automatically added to the Navbar if you don't toggle "Show In Navigation" to false.

## Adding a New Template

This is what you're here for, the thing that makes building a web page with a lot of content quick and easy to do. You can do anything that a React template
can possibly do. The limits are only your own imagination... and the constraints of this particular framework of course!

To add a Template:

1. Go to util/components/templates.
2. Add your new Template component, standard PascalCased.
3. Go to models/model-types.ts.
4. Add your new Template component name to the TemplatesEnum, enum key PascalCased, enum value the same as the key but as a string, PascalCased.
5. Go to util/TemplateMap.tsx.
6. Import your new Template, add it to the TemplateMap with the component name stringified as a key.
7. That's it! Find your new Template as an option in the Templates form and add the Template to any page.

- Bonus: When you figure out exactly what Assets fields will be used in your new Template, you can go to models/Assets and add your component name as a stringed key with a value of 1 to the `templates` object option field. This will cause the field label to be highlighted blue in the form, helping you see what Assets fields are used for a given Template.

## Adding/Deleting/Modifying Form Fields

The Form Fields in the Page, Templates, and Assets Forms are powered by Mongoose! You can add, remove, update, or re-arrange forms by simply
updating the corresponding Mongoose model.

Mongoose fields supported by FormFields.tsx:
1. Subdocuments (single nested)
2. String (with built-in support for enum restriction, see "type" as an example)
3. Boolean
4. Number
5. Custom Schema, single nested (see Page.ts -> meta field for an example)

- Note: Form Fields are resolved by the FormFields.tsx component. This will also be a place to visit for debugging if changes aren't immediately working.

How to add a new field:
1. Add a standard supported Mongoose field to any Mongoose model as you normally would.
2. Reference OptionsType in models/model-types.ts for all built-in "options" These can be added to the `optionsObj` at the top of each model and then spread into the field. Reference the existing pattern.

**Example**:
Let's say you want to add a new Link text field to Assets (you probably want to do this anyway, it's been left in as a fun tutorial 😊 )
1. Go to `models/Assets.ts`.
2. Find the `extLink` field.
3. Below it, add another field `extLinkText`, and set the type as `String`.
4. Add `extLinkText` key and options object to `optionsObj` (reference `extLink`).
5. In `optionsObj.extLinkText` add `formTitle: 'External Link Text'` (you can wait to add `templates` until you know which templates `extLinkText` will be used in (reference `extLink`)).
6. Destructure `optionsObj.extLinkText` into the `extLinkText` Mongoose field you just created (reference `extLink`).
7. Stop/restart your container if utilizing docker. Stop and rerun `npm run dev` if you're not.
8. Edit or create an Asset and see the new "External Link Field" in the form! Add text and update/save and then use the text as your Mongoose field name, `extLinkText`.

- Note: The Context Provider value type for Forms are automatically generated. If you want to add a currently unsupported type, you'll need to also remember to add a resolution in contexts/util/context_util.ts.

## Managing Database Data

But hey, whenever you're updating Templates, or doing custom data or Template work, invariably at some point you'll need to update or manage the data, so doing all this would be pointless... if you didn't have
an easy-to-use Repl window!

1. In /admin/manage-pages, click "Repl", or navigate to /auth/repl manually.
2. Follow the simple instructions and examples for using Mongoose to interact with your database.

That's it! Do anything you can do with Mongoose and Javascript right in your Repl window!

## Going Live

To use Super Simple Headless CMS, you'll need a working knowledge of AWS S3, IAM roles, and Cloudfront. You'll also need a MongoDB Atlas URI.

- Note: Super Simple Headless CMS uses localstack--an AWS emulator--as a docker image in the docker container. This removes the need to connect to AWS during development, but you can still do that if you'd like by setting up the environment variables below in an `.env.local` file and running `npm run dev`. You'll need to connect to AWS and MongoDB Atlas. You can do this if you'd like to test all of your connections locally before going live.

- S3 with IAM Role Walkthrough: https://docs.aws.amazon.com/AmazonS3/latest/userguide/walkthrough1.html
- Cloudfront for S3 Guide: https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/GettingStarted.SimpleDistribution.html
- MongoDB Atlas DB Create Docs: https://www.mongodb.com/basics/create-database

It's recommended to deploy this app to Vercel. On Vercel, you'll want to add the following environment variables:

```
NEXT_PUBLIC_URL=[Your public domain URL] // Your public domain URL, used to hit the /api from the server
NEXT_PUBLIC_CLOUDFRONT_URL=[Your cloudfront url] // Will be generated as part of your CloudFront distribution
NEXT_PUBLIC_SECRET_KEY=[Your secret key] // Used to sign your jsonwebtoken used for authenticating
NEXT_PUBLIC_MY_AWS_SECRET_ACCESS_KEY=[Your AWS Secret Access Key] // Comes from IAM role
NEXT_PUBLIC_MY_AWS_ACCESS_KEY=[Your AWS Access Key] // Comes from IAM role
NEXT_PUBLIC_S3_BUCKET_NAME=[Your S3 Bucket Name] // Important, must match what you created in AWS exactly
MONGODB_URI=[Your MongoDB Atlas SRV connection string] // Get this from your MongoDB Atlas db, click "Connect", and then "Compass", follow the instructions for adding your password to the srv string, copy the srv string here
NEXT_PUBLIC_LOGGED_IN_VAR=[Your logged in var] // Just needs to be semi-unique, use your site name for example, like "myCoolSite-logged-in". Used for browser auth tokens, etc.
NEXT_PUBLIC_DOCKER='false'
```

