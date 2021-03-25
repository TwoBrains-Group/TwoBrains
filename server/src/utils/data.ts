/**
 * This is a collection of data patterns and etc.
 */

export const passwordPattern = /^(?=.{8,128})(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=~]).*$/g
export const passwordPatternString = passwordPattern.source
export const passwordSpecialChars = '@#$%^&+=~'

export const emailPattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
export const emailPatternString = emailPattern.source


/**
 * Project
 */
export const projectNamePattern = /\w{1,128}/g
export const projectNamePatternString = projectNamePattern.source

export const projectDescrPattern = /\w{50,5000}/g
export const projectDescrPatternString = projectDescrPattern.source
