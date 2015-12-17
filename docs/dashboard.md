# Project dashboard

When the analysis step is complete, you will be redirected to the **project dashboard**. Remember that you must save the link to the dashboard page, because you need it to access again at another time.

The project dashboard is composed by the next sections:

> Image with the full dashboard

### 1- Chromosomes explorer (Karyo.js)

This tool allows you to preview how many **insertion sites (IS)** have each chromosome. If you move the mouse over a chromosome, a blue box will be shown below the chromosome with the number of IS on this chromosome.

If you click on a chromosome, you will se the next image:

> Image with a full chromosome view

Each red line represents an IS. If you move the mouse over a red line, a red box will be shown below the line with the next information about the IS:

- **Position** of the IS.
- **Number of reads** that have been mapped to this position.

If you click on a red line, a region centered on the IS will be shown on the regions explorer tool, placed at bottom of this tool.

Also, the chromosome explorer tool allows you to select a bigger region by clicking on the chromosome and drag for select the desired region. When you stop clicking, the region that you have selected will be shown on the regions explorer.

### 2- Regions explorer (Genome Maps)

With this tool, you can visualize chromosomal regions with more detail. This tool consists on two tracks: the **Cancer genes** explorer and the **reads** explorer:

> Image with the Genome Maps

- **Cancer genes track**: this track allows you to visualize the cancer genes on the region, if any. You can move the mouse over a cancer gene (represented with a green rectangle) and a orange box will be shown with information about this gene:
  * **Gene**: gene symbol.
  * **Name**: gene name.
  * **Start-End**: start and end positions of the gene.
  * **Entrez**: Entrez ID of the gene.
  * **Synonyms**: Gene synonyms (like EnsmblID, ect..).
  * **Tumour types (somatic or germline)**.

- **Reads**: this track shows you the reads that have been mapped to the a IS. Like the cancer genes, you can place the mouse over a read (showed with a red rectangle), and you will get the next information:
  * **ID**: read ID, extracted from your FASTA/FASTQ file.
  * **Start-End**: start and end positions where the read has been mapped.
  * **CIGAR**: Cigar code of the read.
  * **MapQ**: quality of the mapping.
