const STORAGE_KEY = "today-tags";
const DEFAULT_TAGS = ["present", "grateful"];

export function formatDate(now, locale = undefined) {
  return new Intl.DateTimeFormat(locale, {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(now);
}

export function formatTime(now, locale = undefined) {
  return new Intl.DateTimeFormat(locale, {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
  }).format(now);
}

export function normalizeTag(value) {
  return value.trim().replace(/\s+/g, " ");
}

export function isDuplicateTag(tags, candidate) {
  return tags.some((tag) => tag.toLocaleLowerCase() === candidate.toLocaleLowerCase());
}

function init() {
  const dateElement = document.querySelector("#date");
  const timeElement = document.querySelector("#time");
  const timezoneElement = document.querySelector("#timezone");
  const listElement = document.querySelector("#tag-list");
  const countElement = document.querySelector("#tag-count");
  const formElement = document.querySelector("#tag-form");
  const inputElement = document.querySelector("#tag-input");
  const messageElement = document.querySelector("#tag-message");

  let tags = loadTags();

  function updateClock() {
    const now = new Date();
    dateElement.textContent = formatDate(now);
    timeElement.textContent = formatTime(now);
    timeElement.dateTime = now.toISOString();
  }

  function renderTags() {
    listElement.replaceChildren();
    tags.forEach((tag) => {
      const item = document.createElement("li");
      item.className = "tag";
      item.append(document.createTextNode(tag));

      const removeButton = document.createElement("button");
      removeButton.type = "button";
      removeButton.setAttribute("aria-label", `Remove ${tag} tag`);
      removeButton.textContent = "×";
      removeButton.addEventListener("click", () => {
        tags = tags.filter((itemTag) => itemTag !== tag);
        saveTags(tags);
        renderTags();
      });
      item.append(removeButton);
      listElement.append(item);
    });
    countElement.textContent = `${tags.length} ${tags.length === 1 ? "tag" : "tags"}`;
  }

  formElement.addEventListener("submit", (event) => {
    event.preventDefault();
    const newTag = normalizeTag(inputElement.value);
    messageElement.textContent = "";
    if (!newTag) return;
    if (isDuplicateTag(tags, newTag)) {
      messageElement.textContent = "That tag is already here.";
      return;
    }
    tags.push(newTag);
    saveTags(tags);
    renderTags();
    formElement.reset();
    inputElement.focus();
  });

  timezoneElement.textContent = Intl.DateTimeFormat().resolvedOptions().timeZone;
  updateClock();
  renderTags();
  window.setInterval(updateClock, 1000);
}

function loadTags() {
  try {
    const storedTags = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return Array.isArray(storedTags) ? storedTags : [...DEFAULT_TAGS];
  } catch {
    return [...DEFAULT_TAGS];
  }
}

function saveTags(tags) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tags));
}

if (typeof document !== "undefined") init();
