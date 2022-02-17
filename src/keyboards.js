import { Markup } from 'telegraf';

export function getNamesKeyboard(names) {
  if (!names?.length) return Markup.inlineKeyboard([[Markup.button.callback('Add', 'add')]]);
  return Markup.inlineKeyboard([
    [Markup.button.callback('Add', 'add'), Markup.button.callback('Remove', 'remove')],
    [Markup.button.callback('Next', 'next')],
  ]);
}

export function getRemovalKeyboard(names) {
  const buttons = names.map((name) => [Markup.button.text(name)]);
  return Markup.keyboard([
    ...buttons,
    [Markup.button.text('❌ Cancel')],
  ]).oneTime();
}
