import { categoryGroups, places } from '../data/places.js';

const elements = {
  mapViewport: document.querySelector('#mapViewport'),
  mapFrame: document.querySelector('#mapFrame'),
  mapLayer: document.querySelector('#mapLayer'),
  markerLayer: document.querySelector('#markerLayer'),
  search: document.querySelector('#placeSearch'),
  clearSearch: document.querySelector('#clearSearch'),
  searchResults: document.querySelector('#searchResults'),
  categoryFilters: document.querySelector('#categoryFilters'),
  zoomIn: document.querySelector('#zoomIn'),
  zoomOut: document.querySelector('#zoomOut'),
  resetMap: document.querySelector('#resetMap'),
  detailPanel: document.querySelector('#detailPanel'),
  detailEmpty: document.querySelector('#detailEmpty'),
  detailContent: document.querySelector('#detailContent'),
  closeDetail: document.querySelector('#closeDetail'),
  statusMessage: document.querySelector('#statusMessage')
};

const detailFields = {
  category: document.querySelector('#detailCategory'),
  status: document.querySelector('#detailStatus'),
  name: document.querySelector('#detailName'),
  summary: document.querySelector('#detailSummary'),
  entrance: document.querySelector('#detailEntrance'),
  hours: document.querySelector('#detailHours'),
  facilities: document.querySelector('#detailFacilities'),
  notice: document.querySelector('#detailNotice'),
  confidence: document.querySelector('#detailConfidence'),
  updated: document.querySelector('#detailUpdated'),
  sources: document.querySelector('#detailSources')
};

const state = {
  scale: 1,
  panX: 0,
  panY: 0,
  pointer: null,
  activeCategory: 'all',
  selectedId: null
};

const markerById = new Map();

function validatePlaces(records) {
  const requiredText = ['id', 'name', 'category', 'summary', 'entrance', 'hours', 'facilities', 'notice', 'verificationStatus', 'confidence', 'updatedAt'];
  const ids = new Set();

  records.forEach((place, index) => {
    requiredText.forEach((field) => {
      if (typeof place[field] !== 'string' || !place[field].trim()) {
        throw new Error(`地点数据第 ${index + 1} 项缺少字段：${field}`);
      }
    });
    if (ids.has(place.id)) throw new Error(`地点 ID 重复：${place.id}`);
    ids.add(place.id);
    if (!Array.isArray(place.aliases) || !Array.isArray(place.photos)) throw new Error(`${place.id} 的数组字段无效`);
    if (!Array.isArray(place.sources) || place.sources.length === 0) throw new Error(`${place.id} 缺少信息来源`);
    if (![place.position.x, place.position.y].every((value) => Number.isFinite(value) && value >= 0 && value <= 1)) {
      throw new Error(`${place.id} 的坐标必须位于 0–1`);
    }
    if (!place.hotspot || ![place.hotspot.x, place.hotspot.y, place.hotspot.width, place.hotspot.height].every(Number.isFinite)) {
      throw new Error(`${place.id} 缺少可点击建筑区域`);
    }
    if (place.hotspot.x < 0 || place.hotspot.x > 1 || place.hotspot.y < 0 || place.hotspot.y > 1 || place.hotspot.width <= 0 || place.hotspot.height <= 0) {
      throw new Error(`${place.id} 的可点击建筑区域无效`);
    }
    if (!['已核实', '部分核实', '待核实'].includes(place.verificationStatus)) throw new Error(`${place.id} 的核实状态无效`);
    if (!['高', '中', '低'].includes(place.confidence)) throw new Error(`${place.id} 的可信度无效`);
  });
}

function normalize(value) {
  return String(value).trim().toLocaleLowerCase('zh-CN').replace(/\s+/g, '');
}

function placeSearchText(place) {
  return normalize([place.name, ...place.aliases, place.category].join(' '));
}

function activeGroup() {
  return categoryGroups.find((group) => group.id === state.activeCategory) ?? categoryGroups[0];
}

function matchesFilters(place) {
  const query = normalize(elements.search.value);
  const group = activeGroup();
  const categoryMatches = group.categories.length === 0 || group.categories.includes(place.category);
  return categoryMatches && (!query || placeSearchText(place).includes(query));
}

function filteredPlaces() {
  return places.filter(matchesFilters);
}

function announce(message) {
  elements.statusMessage.textContent = '';
  window.requestAnimationFrame(() => { elements.statusMessage.textContent = message; });
}

function renderCategories() {
  const fragment = document.createDocumentFragment();
  categoryGroups.forEach((group) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'category-chip';
    button.textContent = group.label;
    button.dataset.category = group.id;
    button.setAttribute('aria-pressed', String(group.id === state.activeCategory));
    button.addEventListener('click', () => {
      state.activeCategory = group.id;
      elements.categoryFilters.querySelectorAll('button').forEach((item) => {
        item.setAttribute('aria-pressed', String(item.dataset.category === state.activeCategory));
      });
      updateFilters(true);
    });
    fragment.append(button);
  });
  elements.categoryFilters.append(fragment);
}

function renderMarkers() {
  const fragment = document.createDocumentFragment();
  places.forEach((place) => {
    const marker = document.createElement('button');
    marker.type = 'button';
    marker.className = 'map-hotspot';
    marker.dataset.placeId = place.id;
    marker.style.left = `${place.hotspot.x * 100}%`;
    marker.style.top = `${place.hotspot.y * 100}%`;
    marker.style.width = `${place.hotspot.width * 100}%`;
    marker.style.height = `${place.hotspot.height * 100}%`;
    marker.setAttribute('aria-label', `查看${place.name}信息，${place.category}，${place.verificationStatus}`);
    marker.title = place.name;
    marker.addEventListener('click', (event) => {
      event.stopPropagation();
      selectPlace(place.id, { focusMap: false, returnFocus: false });
    });
    markerById.set(place.id, marker);
    fragment.append(marker);
  });
  elements.markerLayer.append(fragment);
}

function createResult(place) {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'result-item';
  button.setAttribute('role', 'option');

  const text = document.createElement('span');
  const name = document.createElement('strong');
  name.textContent = place.name;
  const meta = document.createElement('small');
  meta.textContent = `${place.category}${place.aliases.length ? ` · ${place.aliases.slice(0, 2).join(' / ')}` : ''}`;
  text.append(name, meta);

  const status = document.createElement('span');
  status.className = 'result-status';
  status.textContent = place.verificationStatus;
  button.append(text, status);
  button.addEventListener('click', () => selectPlace(place.id, { focusMap: true, returnFocus: false }));
  return button;
}

function renderSearchResults(forceOpen = false) {
  const results = filteredPlaces();
  const queryPresent = Boolean(normalize(elements.search.value));
  const filterPresent = state.activeCategory !== 'all';
  const shouldOpen = forceOpen || queryPresent || filterPresent;

  elements.searchResults.replaceChildren();
  if (shouldOpen) {
    if (results.length) {
      const fragment = document.createDocumentFragment();
      results.forEach((place) => fragment.append(createResult(place)));
      elements.searchResults.append(fragment);
    } else {
      const empty = document.createElement('div');
      empty.className = 'no-results';
      empty.textContent = '没有找到匹配地点。可以尝试简称，或清除类别筛选。';
      elements.searchResults.append(empty);
    }
  }
  elements.searchResults.hidden = !shouldOpen;
  elements.search.setAttribute('aria-expanded', String(shouldOpen));
  elements.clearSearch.hidden = !queryPresent;
  return results;
}

function updateFilters(forceOpen = false) {
  const results = renderSearchResults(forceOpen);
  markerById.forEach((marker, id) => {
    const place = places.find((item) => item.id === id);
    marker.classList.toggle('filtered-out', !matchesFilters(place));
  });
  announce(results.length ? `找到 ${results.length} 个地点` : '没有找到匹配地点');
}

function setText(element, value) {
  element.textContent = value;
}

function renderSources(sources) {
  detailFields.sources.replaceChildren();
  sources.forEach((source) => {
    const item = document.createElement('li');
    if (source.url) {
      const link = document.createElement('a');
      link.href = source.url;
      link.target = '_blank';
      link.rel = 'noreferrer';
      link.textContent = source.label;
      item.append(link);
    } else {
      item.textContent = source.label;
    }
    const type = document.createElement('span');
    type.textContent = ` · ${source.type}`;
    item.append(type);
    detailFields.sources.append(item);
  });
}

function renderDetails(place) {
  setText(detailFields.category, place.category);
  setText(detailFields.status, place.verificationStatus);
  detailFields.status.dataset.status = place.verificationStatus;
  setText(detailFields.name, place.name);
  setText(detailFields.summary, place.summary);
  setText(detailFields.entrance, place.entrance);
  setText(detailFields.hours, place.hours);
  setText(detailFields.facilities, place.facilities);
  setText(detailFields.notice, place.notice);
  setText(detailFields.confidence, place.confidence);
  setText(detailFields.updated, `更新 ${place.updatedAt}`);
  detailFields.updated.dateTime = place.updatedAt;
  renderSources(place.sources);

  elements.detailEmpty.hidden = true;
  elements.detailContent.hidden = false;
  elements.detailPanel.classList.add('open');
}

function selectPlace(id, options = {}) {
  const { focusMap = true, returnFocus = false } = options;
  const place = places.find((item) => item.id === id);
  if (!place) return;

  state.selectedId = id;
  markerById.forEach((marker, markerId) => {
    const selected = markerId === id;
    marker.classList.toggle('selected', selected);
    marker.setAttribute('aria-pressed', String(selected));
  });
  renderDetails(place);
  elements.searchResults.hidden = true;
  elements.search.setAttribute('aria-expanded', 'false');
  if (focusMap) focusPlace(place);
  if (returnFocus) markerById.get(id)?.focus({ preventScroll: true });
  announce(`已选择${place.name}，${place.verificationStatus}`);
}

function closeDetails({ restoreFocus = true } = {}) {
  const previousId = state.selectedId;
  state.selectedId = null;
  markerById.forEach((marker) => {
    marker.classList.remove('selected');
    marker.setAttribute('aria-pressed', 'false');
  });
  elements.detailPanel.classList.remove('open');
  elements.detailContent.hidden = true;
  elements.detailEmpty.hidden = false;
  if (restoreFocus && previousId) markerById.get(previousId)?.focus({ preventScroll: true });
  announce('已关闭地点详情');
}

function clampPan() {
  const frameWidth = elements.mapFrame.offsetWidth;
  const frameHeight = elements.mapFrame.offsetHeight;
  const viewportWidth = elements.mapViewport.clientWidth;
  const viewportHeight = elements.mapViewport.clientHeight;
  const maxX = Math.max(0, (frameWidth * state.scale - viewportWidth) / 2 + 30);
  const maxY = Math.max(0, (frameHeight * state.scale - viewportHeight) / 2 + 30);
  state.panX = Math.max(-maxX, Math.min(maxX, state.panX));
  state.panY = Math.max(-maxY, Math.min(maxY, state.panY));
}

function applyMapTransform() {
  clampPan();
  elements.mapLayer.style.transform = `translate3d(${state.panX}px, ${state.panY}px, 0) scale(${state.scale})`;
}

function setScale(nextScale) {
  state.scale = Math.min(3.6, Math.max(1, nextScale));
  if (state.scale === 1) {
    state.panX = 0;
    state.panY = 0;
  }
  applyMapTransform();
  announce(`地图缩放 ${Math.round(state.scale * 100)}%`);
}

function resetMap() {
  state.scale = 1;
  state.panX = 0;
  state.panY = 0;
  applyMapTransform();
  announce('已恢复地图全景');
}

function focusPlace(place) {
  state.scale = Math.max(state.scale, window.innerWidth <= 940 ? 1.85 : 1.6);
  const frameWidth = elements.mapFrame.offsetWidth;
  const frameHeight = elements.mapFrame.offsetHeight;
  const targetY = window.innerWidth <= 940 ? 0.38 : 0.5;
  state.panX = (0.5 - place.position.x) * frameWidth * state.scale;
  state.panY = (targetY - place.position.y) * frameHeight * state.scale;
  applyMapTransform();
}

function onPointerDown(event) {
  if (event.button !== 0 || event.target.closest('button, input, a')) return;
  state.pointer = { id: event.pointerId, startX: event.clientX - state.panX, startY: event.clientY - state.panY };
  elements.mapViewport.setPointerCapture(event.pointerId);
  elements.mapViewport.classList.add('dragging');
}

function onPointerMove(event) {
  if (!state.pointer || state.pointer.id !== event.pointerId || state.scale === 1) return;
  state.panX = event.clientX - state.pointer.startX;
  state.panY = event.clientY - state.pointer.startY;
  applyMapTransform();
}

function onPointerEnd(event) {
  if (!state.pointer || state.pointer.id !== event.pointerId) return;
  state.pointer = null;
  elements.mapViewport.classList.remove('dragging');
}

function onMapKeydown(event) {
  const panStep = 45;
  const actions = {
    ArrowLeft: () => { state.panX += panStep; },
    ArrowRight: () => { state.panX -= panStep; },
    ArrowUp: () => { state.panY += panStep; },
    ArrowDown: () => { state.panY -= panStep; },
    Home: resetMap,
    '0': resetMap,
    '+': () => setScale(state.scale * 1.2),
    '=': () => setScale(state.scale * 1.2),
    '-': () => setScale(state.scale / 1.2),
    Escape: () => closeDetails({ restoreFocus: false })
  };
  if (!actions[event.key]) return;
  event.preventDefault();
  actions[event.key]();
  if (event.key.startsWith('Arrow')) applyMapTransform();
}

function bindEvents() {
  elements.search.addEventListener('input', () => updateFilters());
  elements.search.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowDown' && !elements.searchResults.hidden) {
      event.preventDefault();
      elements.searchResults.querySelector('button')?.focus();
    }
    if (event.key === 'Escape') {
      elements.search.value = '';
      updateFilters();
      elements.searchResults.hidden = true;
      elements.search.setAttribute('aria-expanded', 'false');
    }
  });
  elements.clearSearch.addEventListener('click', () => {
    elements.search.value = '';
    elements.search.focus();
    updateFilters(state.activeCategory !== 'all');
  });
  elements.zoomIn.addEventListener('click', () => setScale(state.scale * 1.24));
  elements.zoomOut.addEventListener('click', () => setScale(state.scale / 1.24));
  elements.resetMap.addEventListener('click', resetMap);
  elements.closeDetail.addEventListener('click', () => closeDetails());
  elements.mapViewport.addEventListener('pointerdown', onPointerDown);
  elements.mapViewport.addEventListener('pointermove', onPointerMove);
  elements.mapViewport.addEventListener('pointerup', onPointerEnd);
  elements.mapViewport.addEventListener('pointercancel', onPointerEnd);
  elements.mapViewport.addEventListener('keydown', onMapKeydown);
  elements.mapViewport.addEventListener('wheel', (event) => {
    event.preventDefault();
    setScale(state.scale * (event.deltaY < 0 ? 1.12 : 0.9));
  }, { passive: false });
  window.addEventListener('resize', applyMapTransform);
  document.addEventListener('click', (event) => {
    if (!event.target.closest('.search-panel')) {
      elements.searchResults.hidden = true;
      elements.search.setAttribute('aria-expanded', 'false');
    }
  });
}

function start() {
  try {
    validatePlaces(places);
    renderCategories();
    renderMarkers();
    bindEvents();
    applyMapTransform();
    announce(`地图已加载，共 ${places.length} 个待查询地点`);
  } catch (error) {
    console.error(error);
    elements.statusMessage.classList.remove('sr-only');
    elements.statusMessage.textContent = '地点数据加载失败，请稍后重试。';
  }
}

start();
