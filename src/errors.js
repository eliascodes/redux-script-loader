export class InvalidRSL extends TypeError {
  constructor (validationErrors) {
    const msg = `
      ${validationErrors.length} validation errors encountered:
        ${validationErrors.map(({ message }, i) => `${i + 1}: ${message}`).join('\n')}
      `;

    super(msg);
    this.validationErrors = validationErrors;
  }
}
