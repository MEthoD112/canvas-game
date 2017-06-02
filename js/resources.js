// This is class for loading all sprite images
class Images {
    constructor() {
        this.resourceCache = {};
        this.readyCallbacks = [];
    }

    getImg(url) {
        return this.resourceCache[url];
    }

    _loadImg(url) {
        if (this.resourceCache[url]) {
            return this.resourceCache[url];
        } else {
            const img = new Image();
            img.onload = () => {
                this.resourceCache[url] = img;

                if (this.isReady()) {
                    this.readyCallbacks.forEach((func) => {
                        func();
                    });
                }
            };
            this.resourceCache[url] = false;
            img.src = url;
        }
    }

    isReady() {
        let ready = true;
        for(let key in this.resourceCache) {
            if(Object.prototype.hasOwnProperty.call(this.resourceCache, key) &&
              !this.resourceCache[key]) {
                ready = false;
            }
        }
        return ready;
    }

    // Load an image url or an array of image urls
    loadImages(urlOrArr) {
        if(urlOrArr instanceof Array) {
            urlOrArr.forEach( (url) => {
                this._loadImg(url);
            });
        } else {
            this._loadImg(urlOrArr);
        }
    }
}
