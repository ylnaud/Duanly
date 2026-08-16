module.exports = {
  whitespace: /^\s+|\s+$/g,
  templates: /<duanly-template name="([a-zA-Z0-9-_.\\\/]*)">(.*?)<\/duanly-template>/gms,
  complexNamedSlots: /<duanly-slot name="([a-zA-Z0-9-_.\\\/]*)">(.*?)<\/duanly-slot>/gms,
  simpleNamedSlots: /<duanly-slot name="([a-zA-Z0-9-_.\\\/]*)"\s?\/>/gm,
  complexDefaultSlots: /<duanly-slot>(.*?)<\/duanly-slot>/gms,
  simpleDefaultSlots: /<duanly-slot\s?\/>/gm,
  complexImports: /<duanly-import src="([a-zA-Z0-9-_.\\\/]*)"(?:\sas="(.*?)")?>(.*?)<\/duanly-import>/gms,
  simpleImports: /<duanly-import src="([a-zA-Z0-9-_.\\\/]*)"(?:\sas="(.*?)")?\s?\/>/gm,
  links: /<duanly-link\s?(.*?)(?:to|href)="([a-zA-Z0-9-_.#?\\\/]*)"\s?(.*?)>(.*?)<\/duanly-link>/gms
};
