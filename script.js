// =============================================================================
// constants
// =============================================================================

const IMAGE_SIZE = {
  WIDTH: 200,
  HEIGHT: 800,
};

const DEFAULT_MAP = {
  DURATION: 6_000,
  FRAGMENT_WIDTH: IMAGE_SIZE.WIDTH,
  FRAGMENT_HEIGHT: 10,
  PERIMETER: IMAGE_SIZE.HEIGHT,
  RADIUS: 36,
  ROTATE_X: 56,
  ROTATE_Y: 20,
  ROTATE_Z: 310,
};

const CONTROL_MAP = {
  DURATION: {
    MIN: 1_000,
    MAX: null,
    DEFAULT: DEFAULT_MAP.DURATION,
    DISABLED: false,
  },
  FRAGMENT_WIDTH: {
    MIN: null,
    MAX: null,
    DEFAULT: DEFAULT_MAP.FRAGMENT_WIDTH,
    DISABLED: true,
  },
  FRAGMENT_HEIGHT: {
    MIN: 1,
    MAX: (1 / 2) * IMAGE_SIZE.HEIGHT,
    DEFAULT: DEFAULT_MAP.FRAGMENT_HEIGHT,
    DISABLED: false,
  },
  PERIMETER: {
    MIN: null,
    MAX: null,
    DEFAULT: DEFAULT_MAP.PERIMETER,
    DISABLED: true,
  },
  RADIUS: {
    MIN: 0,
    MAX: Math.floor(DEFAULT_MAP.PERIMETER / (2 * Math.PI)),
    DEFAULT: DEFAULT_MAP.RADIUS,
    DISABLED: false,
  },
  ROTATE_X: {
    MIN: 0,
    MAX: 360,
    DEFAULT: DEFAULT_MAP.ROTATE_X,
    DISABLED: false,
  },
  ROTATE_Y: {
    MIN: 0,
    MAX: 360,
    DEFAULT: DEFAULT_MAP.ROTATE_Y,
    DISABLED: false,
  },
  ROTATE_Z: {
    MIN: 0,
    MAX: 360,
    DEFAULT: DEFAULT_MAP.ROTATE_Z,
    DISABLED: false,
  },
};

// =============================================================================
// elements
// =============================================================================

const elements = {
  container: document.querySelector(".container"),
  duration: document.querySelector("#duration"),
  fragmentWidth: document.querySelector("#fragment-width"),
  fragmentHeight: document.querySelector("#fragment-height"),
  perimeter: document.querySelector("#perimeter"),
  radius: document.querySelector("#radius"),
  rotateX: document.querySelector("#rotate-x"),
  rotateY: document.querySelector("#rotate-y"),
  rotateZ: document.querySelector("#rotate-z"),
  reset: document.querySelector("#reset"),
};

// =============================================================================
// functions
// =============================================================================

function render() {
  const duration = elements.duration.valueAsNumber;
  const fragmentWidth = elements.fragmentWidth.valueAsNumber;
  const fragmentHeight = elements.fragmentHeight.valueAsNumber;
  const perimeter = elements.perimeter.valueAsNumber;
  const radius = elements.radius.valueAsNumber;
  const rotateX = elements.rotateX.valueAsNumber;
  const rotateY = elements.rotateY.valueAsNumber;
  const rotateZ = elements.rotateZ.valueAsNumber;

  const lineLength = perimeter / 2 - Math.PI * radius;
  const lineProportion = lineLength / perimeter;
  const semiCircleLength = Math.PI * radius;
  const semiCircleProportion = semiCircleLength / perimeter;
  const fragmentCount = Math.floor(perimeter / fragmentHeight);
  const delayStep = duration / fragmentCount;
  const keyframes = [
    {
      transform: `translateY(0px) rotateX(0deg)`,
      offset: 0,
    },
    {
      transform: `translateY(0px) rotateX(180deg)`,
      offset: semiCircleProportion,
    },
    {
      transform: `translateY(${lineLength}px) rotateX(180deg)`,
      offset: semiCircleProportion + lineProportion,
    },
    {
      transform: `translateY(${lineLength}px) rotateX(360deg)`,
      offset: semiCircleProportion + lineProportion + semiCircleProportion,
    },
    {
      transform: `translateY(0px) rotateX(360deg)`,
      offset: 1,
    },
  ];

  const domFragment = document.createDocumentFragment();

  elements.container.replaceChildren();
  elements.container.style.width = `${IMAGE_SIZE.WIDTH}px`;
  elements.container.style.height = `${lineLength}px`;
  elements.container.style.transform =
    `rotateX(${rotateX}deg) ` +
    `rotateY(${rotateY}deg) ` +
    `rotateZ(${rotateZ}deg)`;

  for (let i = 0; i < fragmentCount; i++) {
    const fragmentWrapper = document.createElement("div");
    const fragment = document.createElement("div");

    fragmentWrapper.classList.add("fragment-wrapper");
    fragmentWrapper.style.width = `${fragmentWidth}px`;
    fragmentWrapper.style.height = `${fragmentHeight}px`;

    fragment.classList.add("fragment");
    fragment.style.backgroundPositionY = `${i * fragmentHeight}px`;
    fragment.style.width = `${fragmentWidth}px`;
    fragment.style.height = `${fragmentHeight}px`;
    fragment.style.transform = `translateZ(${radius}px)`;

    fragmentWrapper.append(fragment);
    domFragment.append(fragmentWrapper);

    fragmentWrapper.animate(keyframes, {
      duration: duration,
      delay: -i * delayStep,
      iterations: Infinity,
    });
  }

  elements.container.append(domFragment);
}

function setContainerTransform() {
  elements.container.style.transform =
    `rotateX(${elements.rotateX.value}deg) ` +
    `rotateY(${elements.rotateY.value}deg) ` +
    `rotateZ(${elements.rotateZ.value}deg)`;
}

function setControl(element, control) {
  if (typeof control.MIN === "number") element.setAttribute("min", control.MIN);
  if (typeof control.MAX === "number") element.setAttribute("max", control.MAX);
  if (control.DISABLED) element.setAttribute("disabled", "");

  element.value = control.DEFAULT;
}

// =============================================================================
// events
// =============================================================================

elements.duration.addEventListener("change", render);
elements.fragmentHeight.addEventListener("change", render);
elements.radius.addEventListener("change", render);
elements.rotateX.addEventListener("input", setContainerTransform);
elements.rotateY.addEventListener("input", setContainerTransform);
elements.rotateZ.addEventListener("input", setContainerTransform);
elements.reset.addEventListener("click", () => {
  elements.duration.value = DEFAULT_MAP.DURATION;
  elements.fragmentWidth.value = DEFAULT_MAP.FRAGMENT_WIDTH;
  elements.fragmentHeight.value = DEFAULT_MAP.FRAGMENT_HEIGHT;
  elements.perimeter.value = DEFAULT_MAP.PERIMETER;
  elements.radius.value = DEFAULT_MAP.RADIUS;
  elements.rotateX.value = DEFAULT_MAP.ROTATE_X;
  elements.rotateY.value = DEFAULT_MAP.ROTATE_Y;
  elements.rotateZ.value = DEFAULT_MAP.ROTATE_Z;

  render();
});
window.addEventListener("load", () => {
  setControl(elements.duration, CONTROL_MAP.DURATION);
  setControl(elements.fragmentWidth, CONTROL_MAP.FRAGMENT_WIDTH);
  setControl(elements.fragmentHeight, CONTROL_MAP.FRAGMENT_HEIGHT);
  setControl(elements.perimeter, CONTROL_MAP.PERIMETER);
  setControl(elements.radius, CONTROL_MAP.RADIUS);
  setControl(elements.rotateX, CONTROL_MAP.ROTATE_X);
  setControl(elements.rotateY, CONTROL_MAP.ROTATE_Y);
  setControl(elements.rotateZ, CONTROL_MAP.ROTATE_Z);

  render();
});
