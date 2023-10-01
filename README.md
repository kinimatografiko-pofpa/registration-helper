# Registration Helper

## About

This is a web client SPA designed to aid the digital member registration process of the [Cinema Department](https://kinimatografiko.gr) of the Students' Cultural Society Club [(P.O.F.P.A.)](https://pofpa.gr) of the [University of Athens.](https://www.uoa.gr).

The registrations are now a google form that must be filled and then with the aid of the registration helper, printed and signed by each member in order to maintain validity. The web client uses OAuth to get the auth details of an account with read/write access to the form's connected google sheet. It then polls the sheet for changes and shows the entries to be printed and marked as signed.

## Running

After cloning the repository, run yarn to get all the dependencies.

```
yarn
```

You also need to make a file called `.env`, and fill it with the appropriate details, see the `.env.template` file for it's structure.

To start the development server, run:

```
yarn dev
```

and to output a build

```
yarn build
```

## Contributing

Contributions are welcome and encouraged! Please start an issue first before submitting a PR.
