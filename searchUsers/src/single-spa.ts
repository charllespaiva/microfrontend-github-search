import "core-js/es7/reflect";
import { platformBrowserDynamic } from "@angular/platform-browser-dynamic";
import { enableProdMode } from "@angular/core";
import { MainModule } from "./main-module";
import { environment } from "../environments/environment";
import { Router } from "@angular/router";

if (environment.production) {
  enableProdMode();
}

const spaProps = {
  bootstrappedModule: null,
  Router: Router
};

export function bootstrap(props) {
  return Promise.resolve();
}

export function mount(props) {
  createDomElement();

  return platformBrowserDynamic([
    { provide: "localStoreRef", useValue: props.store }, 
  ])
    .bootstrapModule(MainModule)
    .then(module => {
      return (spaProps.bootstrappedModule = module);
    });
}
 
export function unmount(props) {
  return new Promise((resolve, reject) => {
    if (spaProps.Router) {
      const routerRef = spaProps.bootstrappedModule.injector.get(
        spaProps.Router
      );
      routerRef.dispose();
    }
    spaProps.bootstrappedModule.destroy();
    delete spaProps.bootstrappedModule;
    resolve();
  });
}

function createDomElement() { 
  let el = window.document.getElementById("searchUsers");
  if (!el) {
    el = window.document.createElement("searchUsers");
    el.id = "searchUsers";
    window.document.getElementById("apps").appendChild(el);
  }

  return el;
}
