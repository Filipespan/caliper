import { FormControl } from '@angular/forms';
import { forEachCase } from '../../../testing/spy';
import { isAuditableUrl, urlValidator } from './url-validator';

describe('isAuditableUrl', () => {
  forEachCase(
    'accepts',
    [
      'https://example.com',
      'http://example.com',
      'https://example.com/path?query=1#hash',
      'https://sub.domain.example.co.uk',
      'https://xn--80ak6aa92e.com',
      'https://münchen.de',
      '  https://example.com  ',
    ],
    (value) => expect(isAuditableUrl(value)).toBe(true),
  );

  forEachCase(
    'rejects',
    [
      'example.com',
      'javascript:alert(1)',
      'data:text/html,<h1>hi</h1>',
      'ftp://example.com',
      'https://localhost',
      'https://example.',
      'https://',
      '',
    ],
    (value) => expect(isAuditableUrl(value)).toBe(false),
  );
});

describe('urlValidator', () => {
  it('stays quiet while the field is empty', () => {
    expect(urlValidator(new FormControl(''))).toBeNull();
  });

  it('flags a value that is not auditable', () => {
    expect(urlValidator(new FormControl('example.com'))).toEqual({ url: true });
  });

  it('passes a valid value through', () => {
    expect(urlValidator(new FormControl('https://example.com'))).toBeNull();
  });
});
