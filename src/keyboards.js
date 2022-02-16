import { Markup } from 'telegraf';

export function getNamesKeyboard(ctx) {
  if ((ctx.session.names.length ?? 0) !== 0) {
    return Markup.inlineKeyboard([
      [Markup.button.callback('Add', 'add'), Markup.button.callback('Remove', 'remove')],
      [Markup.button.callback('Next', 'next')],
    ]);
  }
  return Markup.inlineKeyboard([
    [Markup.button.callback('Add', 'add')],
  ]);
}

export function getRemovalKeyboard(ctx) {
  const buttons = ctx.session.names.map((name) => [Markup.button.text(name)]);
  return Markup.keyboard([
    ...buttons,
    [Markup.button.text('❌ Cancel')],
  ]).oneTime();
}
