import pt from '@modules/pretty-time'

export const prepareIdea = (idea: any) => {
    idea.prettyCreationDatetime = pt.prettyDiff(idea.creationDatetime)
    idea.creationDatetime = pt.prettyDate(idea.creationDatetime)
    return idea
}

export const prepareIdeas = (ideas: any[]) => ideas.map(prepareIdea)
