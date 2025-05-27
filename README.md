# Blogger x Autz.org

This script will enable membership in your Blogger blogs.

To make this script works, you need to have an App in Autz.org. You can [create one](https://autz.org) if you don't. (You need to activate Developer Mode in the account page).

## Script setup

In the [script.js](./script.js) file, you will see 3 most important variable:

1. `window.SUBSCRIBER_IDS`:
    This is the list of user id that has been a member.
2. `window.AUTZORG_APP_ID`:
    This is app ID of your app
3. `window.MEMBERSHIP_CONFIG`:
    This is the place to set the wordings and links

Copy the script then edit the value only. Don't edit the variable naming.

We recommend you NOT to edit the `MEMBERSHIP_CONFIG` (only edit if you understand).

<img width="917" alt="image" src="https://github.com/user-attachments/assets/f2409a5e-ff10-4ade-b0cb-8aa00baa6fee" />

## Blogger setup

### Widget

You need to go to "Layout" menu, and add a new "HTML/Javascript" widget. Then paste the updated script.

Whenever someone subscribes to your membership, you need to edit this widget and add the user ID to the `window.SUBSCRIBER_IDS` list.

<img width="421" alt="image" src="https://github.com/user-attachments/assets/01941acd-41c7-424a-a28b-0da3ff629e58" />


### Subscribe Page

You need a page to explain how to be a member. Go to "Pages" menu and create a new one.

We recommend you to put the title "Subscribe". If you use another title, you need to change `subscribeLink` in the `window.MEMBERSHIP_CONFIG` accordingly.

Make sure the Page permalink should be the same as `window.MEMBERSHIP_CONFIG.subscribeLink`.

<img width="567" alt="image" src="https://github.com/user-attachments/assets/57eb5824-265b-40cf-97f3-80818749eb87" />


### Article

To make a **member only** article, you need to add `member-only` word in the beginning of your article. Then followed by a page break.

<img width="913" alt="image" src="https://github.com/user-attachments/assets/03bbc112-649e-4280-ae6e-8e13b144e199" />
