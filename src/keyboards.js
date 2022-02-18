import { Markup } from 'telegraf';

export function getNamesKeyboard(names) {
  if (!names?.length) return Markup.inlineKeyboard([[Markup.button.callback('Add', 'add')]]);
  return Markup.inlineKeyboard([
    [Markup.button.callback('Add', 'add'), Markup.button.callback('Remove', 'remove')],
    [Markup.button.callback('Next', 'next')],
  ]);
}

export function getRemovalKeyboard(names) {
  const buttons = names.map((name) => Markup.button.text(name));
  const rows = buttons.map((btn) => [btn]);
  return Markup.keyboard([
    ...rows,
    [Markup.button.text('❌ Cancel')],
  ]).oneTime();
}

export function getQuestionKeyboard() {
  const buttons = ['yes', 'no'].map((name) => Markup.button.callback(name, name));
  return Markup.inlineKeyboard([[...buttons]]);
}

export function getSelectKeyboard(options) {
  function makeButton([name, chosen]) {
    if (chosen) return Markup.button.callback(`✅${name}`, name);
    return Markup.button.callback(name, name);
  }
  const buttons = Object.entries(options).map(makeButton);
  const rows = buttons.map((button) => [button]);
  return Markup.inlineKeyboard([
    ...rows,
  ]);
}
