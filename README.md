# Change Tracker
*A web app for writers, editors and other text enjoyers to track changes between different versions of text complete with modern, advanced features.*

The **Change Tracker** web app distinguishes between two or more text files, including copied-and-pasted text, PDFs, screenshots and more, with detailed comparison and contrast features providing a high-level overview and statistical analysis of the changes. It incorporates deep research, modern UI/UX principle, and advanced analytical features tailored for professional writers and editors.

The six main features at the time of the app's initial launch (Oct. 1, 2025) include:
* Total Word Count
* Paragraph Count
* Sentence Count
* Average Sentence Length
* Flesch Reading Ease
* Flesch-Kincaid Grade

## App Design

A state-of-the-art web application designed for writers, editors, legal professionals and academics, performs sophisticated comparisons of text documents, **Change Tracker** moves beyond simple "diff" checking to provide a rich, multi-layered analysis, combining quantitative statistics, qualitative insights and advanced stylistic metrics to reveal not just what changed but how and why the changes matter.

### Core Features (The Foundation)

The app's dashboard will immediately present users with a clear, concise overview based on the six foundational metrics, modelled after a basic analysis of the following six distinguishing features.
1. Total Word Count: A straightforward count to measure overall length changes.
2. Paragraph Count: Helps identify structural changes, such as combining or splitting sections.
3. Sentence Count: Tracks the granularity of the text and impacts overall pacing.
4. Average Sentence Length: A key indicator of stylistic change towards either conciseness or complexity.
5. Flesch Reading Ease: A score from 0-100 indicating how easy the text is to read. Higher scores mean easier readability. This is crucial for web copy and public-facing documents.
6. Flesch-Kincaid Grade Level: Translates the readability score into a U.S. school grade level, providing an intuitive benchmark for the target audience's comprehension level.

### Advanced Comparison Features (Deep Research & Implementation)
To elevate Change Tracker beyond a simple statistics tool, it features an integrated suite of advanced analytical features rooted in computational linguistics and professional editorial practices.

📊 **1. Enhanced Readability Suite**
While the Flesch-Kincaid tests are a great start, a robust tool should offer multiple models as no single formula is perfect for all contexts.
* Gunning Fog Index: Measures readability by focusing on sentence length and the prevalence of complex words (three or more syllables). It's particularly useful for business and technical writing.
* SMOG Index (Simple Measure of Gobbledygook): Estimates the years of education needed to understand a piece of writing. It is often used for healthcare and official documents due to its high accuracy.
* Dale-Chall Readability Formula: This formula is highly regarded because it compares the text against a list of 3,000 words familiar to most 4th-grade students, making it excellent for assessing texts for a general audience.

🧠 **2. Lexical & Vocabulary Analysis**
This suite of features analyzes the richness and complexity of the vocabulary itself.
* Lexical Density: Calculates the ratio of content words (nouns, verbs, adjectives) to function words (pronouns, prepositions, conjunctions). A higher density indicates a more informative and less conversational text. An editor might use this to see if a revision successfully made a formal document more approachable.
* Lexical Diversity (Type-Token Ratio – TTR): Measures the range of different words used. A low TTR might indicate repetitive language, while a high TTR suggests a richer vocabulary. The app will use a corrected TTR to account for varying document lengths.
* Word Frequency Analysis: Identifies and compares the most frequently used words in each version. This can reveal shifts in focus or tone (such as a marketing copy revision that increases the frequency of "exclusive" and "limited time”).

✍️ **3. Stylistic & Rhetorical Analysis**
This is where the app truly shines for the professional writer: it analyzes the “how” of the writing.
* Voice Analysis (Active vs. Passive): Calculates the percentage of sentences written in the passive voice. High passive voice usage can make writing feel weak or evasive. The tool will highlight passive constructions, allowing for targeted edits.
* Sentence Structure Variety: The app won't just measure sentence length; it will classify sentences as simple, compound, complex, or compound-complex. A good writer varies these structures. The report will visualize this mix, showing if a revision has successfully broken up a monotonous string of simple sentences.
* Adverb & "Weak" Word Usage: Identifies the frequency of adverbs (especially "-ly" adverbs) and flags common "filler" or "weak" words (e.g., "very," "really," "just," "actually"). This helps writers produce stronger, more direct prose, in the spirit of writers like Hunter S. Thompson who favored muscular language.

🤖 **4. AI-Powered Qualitative Summary**
This is the app's signature feature. Using a powerful Large Language Model (LLM), Change Tracker will generate a concise, human-readable "High-Level Overview" of the changes, exactly like the one provided in the prompt's solution. It will synthesize the statistical data into an executive summary, stating, for example: "The primary change was a structural reorganization, shifting from a linear news report to a feature-style article by extracting background information into a sidebar. The revised text also employs a more active voice and slightly shorter sentences, resulting in a more engaging and accessible tone."
