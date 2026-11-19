# Spread recipes by intent — widget, dashboard, tracker, list, timeline

Background: `spreads-audit.md`. Each recipe was drawn on this chat's canvas in one
`render`; the shot is the fixed version (TASTE.md applied through values and slots, no
code). Every "find query" was run and returns the spread as **hit #1**.

How to use: match the person's words to an intent below (see "Intent words"), take the
recipe's spread and slots as written, bind your data, render with `picture: true`, and
check the shot against TASTE.md before placing it on a page or window.
On a page: `{id, kind: "spread", layout: [<the layout below>], source: {feed: {dough, inputs, refresh}}}`;
slot paths then start at the dough's output port (`result.items`). A desktop widget is a
`kind: card` window (place `{corner, width: 380, height: 520}`) whose page holds that one block.

---

## 1. Widget — one number that matters
**Spread:** `postlab.sp-803ff7ed20ec444abdef6022f9fd53a2` (foundation/metric, "One metric")
**Find:** `a single number given the whole card`
**Shot:** `shots/recipe-widget-metric.jpg`
```json
{"spread": "postlab.sp-803ff7ed20ec444abdef6022f9fd53a2",
 "slots": {"value": "value", "label": "label", "unit": "unit", "note": "note", "series": "series"}}
value: {"label": "올해 읽은 책", "value": "17", "unit": "권",
        "note": "목표 24권 · 남은 6주에 7권", "series": [1,3,4,6,8,9,11,12,14,15,17]}
```
Fixes applied: no `delta` (it defaults to the `delta` field and draws a meaningless chip —
leave the field off the value, not just the slot); the goal lives in one short note.
Watch: it draws its own bordered card → in a `card` window that is a card in a card
(TASTE 6). Until a borderless knob exists, prefer it on pages; for a desk card use
progress_ring `postlab.sp-ac0b7d1cbda84ff4949e5e15cb3410b8` (find: `single completion ring gauge`,
no border, but ~50 px — no size knob).

## 2. Dashboard — headline numbers over one trend
**Spreads:** `postlab.sp-18f46dcb12e24ee2a3b27a9cb55d83da` (metric_ribbon) +
`postlab.sp-a9c405bacb604c438682c14a9fc5bb78` (trend)
**Find:** `open metric strip` · `values measured over time line chart`
**Shot:** `shots/recipe-dashboard-ribbon-trend.jpg`
```json
{"layout": [
 {"spread": "postlab.sp-18f46dcb12e24ee2a3b27a9cb55d83da",
  "slots": {"items": "items", "label": "label", "value": "value", "detail": "detail"}},
 {"spread": "postlab.sp-a9c405bacb604c438682c14a9fc5bb78",
  "slots": {"series": "weeks", "xLabels": "weekLabels", "reference": "budget", "unit": "k",
            "mode": "line", "height": 140, "baselineLabel": "예산", "quantity": "주간 지출"}}]}
value: {"items": [{"label": "지출", "value": "₩1.84M", "detail": "지난달보다 -12%"}, …3 items],
        "weeks": [{"label": "지출", "points": [520,470,455,395], "tone": "brand"}],
        "weekLabels": ["1주","2주","3주","4주"], "budget": [500,500,500,500]}
```
Fixes applied: metric_ribbon instead of kpis (open strip, no tiles or arrow pills —
TASTE 2, 5, 6); **3 items** (a 4th wraps to a lone second row); short numbers (₩1.84M);
deltas as plain text in `detail`; `tone: "brand"` on the series (a falling line otherwise
draws red, which reads as bad even when spending falls); `mode: line` (the dashed
`reference` budget line does not draw in `bars` mode).
Watch: `trend.title` is a FIELD KEY — a literal renders blank. `height` must be a number.

## 3. Tracker — a habit or streak over weeks
**Spread:** `postlab.sp-f67214017a2d418f8e7edd7c272aed8a` (calendar_heatmap)
**Find:** `day-by-day activity calendar` (also `github style contribution calendar`)
**Shot:** `shots/recipe-tracker-heatmap.jpg`
```json
{"spread": "postlab.sp-f67214017a2d418f8e7edd7c272aed8a",
 "slots": {"days": "days", "title": "summary", "unit": "분", "weekStart": "mon", "monthLabels": false}}
value: {"summary": "88일 중 62일 달렸어요", "days": [{"date": "2026-08-24", "value": 30}, …]}
```
Fixes applied: `title` bound to a field holding the finding ("88일 중 62일"), not the
topic; `monthLabels: false` (under ~6 months the labels wrap "Au/g").
Watch: `days` must be `[{date: "YYYY-MM-DD", value: number}]` — a bare number[] draws
nothing; `weekStart` takes exactly `sun|mon` ("monday" is silently ignored); weekday labels
stay English. On a page: a feed on a schedule plus `keep: {as: series}` builds the days.

## 4. List — a to-do or checklist
**Spread:** `postlab.sp-327f35e24cd54ab9bcefe4be07d7fb01` (task_list, "Checklist")
**Find:** `checkable to-do list`
**Shot:** `shots/recipe-list-task_list.jpg`
```json
{"spread": "postlab.sp-327f35e24cd54ab9bcefe4be07d7fb01",
 "slots": {"items": "items", "title": "title", "itemTitle": "title", "done": "done",
           "due": "due", "overdue": "overdue", "doneItems": "doneItems",
           "doneTitle": "완료 2", "priority": null},
 "knobs": {"defaultOpen": "false", "layout": "aligned"}}
value: {"title": "오늘 할 일 3개 · 1개 지남",
        "items": [{"id": "t5", "title": "카드 결제일 체크", "due": "어제", "overdue": true}, …],
        "doneItems": [{"id": "t1", "title": "주간 보고서 초안 보내기", "done": true}, …]}
```
Fixes applied: done rows go in `doneItems` (in `items` they stay unfolded); short due
words ("어제/오늘/내일") instead of ISO dates that wrap; `priority: null` (it prints raw
"high/low" — TASTE 4, 5); `overdue: true` gives the one colour, on the late row only.
In a 380 px card window use `layout: "flow"` (with `aligned` the due word drops to its
own line — blind test, `shots/blind-todo-v1.png` vs `v2`). With `keep: {as: list}` there is
one list, so `doneItems` cannot be split and done rows stay unfolded at the bottom.
Watch: the done fold uses a chevron — acceptable as the single disclosure, but a "완료 2"
word is already beside it. On a page: `keep: {as: list, key: id}` with no feed makes it the
person's own list.

## 5. Timeline — today's schedule
**Spread:** `postlab.sp-3d99b91b2c71422b9062ba3b3e828a7e` (day_timeline, "Hourly calendar")
**Find:** `hourly calendar timetable` (also `calendar timetable of the day`)
**Shot:** `shots/recipe-timeline-day_timeline.jpg`
```json
{"spread": "postlab.sp-3d99b91b2c71422b9062ba3b3e828a7e",
 "slots": {"events": "events", "title": "title", "hourStart": 9, "hourEnd": 18},
 "knobs": {"view": "calendar"}}
value: {"title": "오늘 일정 · 다음은 14:00 디자인 리뷰",
        "events": [{"title": "팀 스탠드업", "start": "2026-11-19T09:30", "end": "2026-11-19T09:45"}, …]}
```
Fixes applied: `hourStart/hourEnd` trim the grid to the working day; the title states the
next event. Watch: hour labels are English ("9 AM"), no now-line, one colour for all —
library fixes, not slot fixes. `view: auto` switches to a list on narrow panes (a 380 px
card); use `calendar` to keep the grid. For "which days are free" use day_strip
`postlab.sp-2d908db8570d46b784e2e11c2870b808` instead.

---

## Intent words the search needs

None of these appear in any spread's `search` terms today (audit §3a: `widget` 0,
`desktop` 0, `app` 0, `clock` 0, `habit` 0; `dashboard` 1, `tracker` 2). Proposed
`search.intents` per spread, en + ko:

| Spread | en | ko |
|---|---|---|
| metric | widget, number widget, goal widget, counter, single stat card | 위젯, 숫자 위젯, 목표 위젯, 카운터 |
| progress_ring | goal widget, progress widget, percent done, ring | 진행률 위젯, 목표 달성률, 링 |
| metric_ribbon | dashboard, dashboard header, summary numbers, overview | 대시보드, 요약 지표, 한눈에 보기 |
| trend | dashboard chart, history, over time, weekly/monthly trend | 추이, 변화 그래프, 주간·월간 추이 |
| calendar_heatmap | habit tracker, streak, daily log, activity tracker | 습관 트래커, 연속 기록, 매일 기록, 잔디 |
| task_list | to-do, todo widget, checklist, tasks, reminders | 할 일, 투두, 체크리스트, 할 일 위젯 |
| day_timeline | schedule, today, agenda widget, day planner, calendar widget | 오늘 일정, 하루 일정, 일정 위젯, 플래너 |
| day_strip | free days, availability, which days | 가능한 날, 빈 날짜 |
| watchlist | stock tracker, price tracker, watchlist | 관심 종목, 가격 추적 |

And one rule for ranking: an exact intent-word hit outranks a field-word hit, and for
"dashboard" / "page" / "app" asks the answer names a layout (like recipe 2), not a lone primitive.

## TASTE.md check of these recipes

| Recipe | 1 frame | 2 words | 3 two sizes | 4 less text | 5 no drama | 6 one surface |
|---|---|---|---|---|---|---|
| widget (metric) | window gives it | ✓ | ✗ big figure + label + note (3) | ✓ | ✓ | ✗ own border in a card window |
| dashboard | page gives it | ✓ | ✗ ribbon figures large | ✓ short numbers | ✓ one brand line | ✓ |
| tracker | window gives it | ✓ | ✓ | ✓ | ✓ one green | ✓ |
| list | window gives it | ~ one chevron on the done fold | ✓ | ✓ | ✓ colour only on overdue | ✓ |
| timeline | window gives it | ✓ | ✓ | ✓ | ✓ | ✓ |

Rule 3 is the one spreads cannot meet by slots: a figure-led spread (metric, ribbon) draws
its number larger than 13 px. Treat the headline figure as the one sanctioned exception, or
add a `compact` knob to those spreads.
